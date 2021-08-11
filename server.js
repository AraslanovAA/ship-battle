/*
сервер реагирует на запросы 2 видов
1- запрос с выстрелом по указанной клетке
2- запрос о количестве не потопленных кораблей
*/

const http = require('http');
const port = 3000
const host = 'localhost'

var pgp = require('pg-promise')();
var cn = {host: 'localhost', port: 5433, database: 'postgres', user: 'postgres', password: '1'};
var db = pgp(cn); 


const server = http.createServer();
server.listen(port,host, () =>{
    console.log('сервер работает')
    
});
server.on('request', (req, res) => {
    if (req.method=='GET'){
        console.log('откуда get запрос-то прилетел');
    }
    else{
        if (req.method=='POST'){
            if(req.url ==='/shoot'){

                (async function () {
                let body = [];
            await req.on('data', function(chunk) {
                    body.push(chunk);
                    body = Buffer.concat(body).toString();
                    body = JSON.parse(body);//успешно полуили данные
                log_sql('info', chunk + '/shoot');
            })
            /* 
            При получении запроса проверяем ведётся ли в БД игра с таким пользователем
                если игра не существует создаётся запись о пользователе в таблице field и расставляются корабли в таблице ship
            */
           let serverName = body["user"] +'/server';
            let newUser = await checkGameExist_sql(body["user"]);
            if (!newUser){
                let id_field = await createNewField_sql(body["user"]);
                let id_field_server = await createNewField_sql(serverName);
                await fillField_sql(id_field);
                await fillField_sql(id_field_server);
            }
           /* после того как убедились, что пользователь существует обрабатываем выстрел
           при выстреле по клетке:
    1. проверить не стреляли ли по этой клетке раньше? если стреляли то вернуть состояние клетки
    2. записываем сделанный ход в таблицу field
    3. проверяем по таблице ships есть ли в этой клетке корабль
        3.1 при попадении в корабль проверяем убили корабль или нет
            если потопили вовращаем массив с клетками всего потопленного корабля и состоянием kill
            если не потопили возвращаем состояние hit
        3.2. при промахе возвращаем состояние miss
    */
                  
            let checkRepeat = await checkRepeat_sql(body["user"], body["cell"]);//проверяем что в эту клетку пользователь еше не стрелял
            let resObj;
            if(!checkRepeat['result']){
            //получаем клетки в которых расположен корабль в который пользователь попал
            let ship = await shoot_sql(body["user"], body["cell"], checkRepeat['id_field']);
            
            if (!isEmpty(ship)){//если получили массив клеток корабля, значит попали не по пустой клетке
                //тогда нужно проверить добили мы кораблик или нет/ производился ли выстрел по всем клеткам корабля
                let silk = await checkSilk_sql(body["user"], ship[0]['cells']);
                if(silk){//тогда кораблю необходимо поменять статус в таблице ship
                    await sink_sql(body["cell"], checkRepeat['id_field'])
                    resObj = {//возвращаем уничтожение корабля
                        "shoot_result" : "kill",
                        "cell" : ship[0]['cells']
                    }
                }
                else{
                    resObj = {//возвращаем попадение в корабль
                        "shoot_result" : "hit",
                        }
                }

            }
            else{//если попали по пустой клетке то возвращаем мисс
                resObj = {
                    "shoot_result" : "miss",
                    }
            }
            //сформировали результат выстрела пользователя, очередь сервера делать выстрел
            //здесь
            /*повторяем алгоритм для выстрела сервера
                1. полуить массив клеток в которые сервер уже стрелял
                2. сгенерировать число
                3. првоерить есть ли это число в массиве
                4. найти удовлетворяющее число
                5. добавить новое число в список на сервер
                6.проверить не попали ли мы в кораблик
                7. проверить не потопили ли мы корабль
                8.обновить информацию в бд если нужно
            */
                let hitCell_server = await getHitCell_sql(serverName);//находим клетку по которой сервер еще не стрелял
                let ship_server = await shoot_sql(serverName, hitCell_server["cell"], hitCell_server['id_field']);
            
                if (!isEmpty(ship_server)){//если получили массив клеток корабля, значит попали не по пустой клетке
                    //тогда нужно проверить добили мы кораблик или нет/ производился ли выстрел по всем клеткам корабля
                    let silk = await checkSilk_sql(serverName, ship_server[0]['cells']);
                    if(silk){//тогда кораблю необходимо поменять статус в таблице ship
                    await sink_sql(hitCell_server["cell"], hitCell_server['id_field'])
                    //сервер потопил корабль
                    resObj['server_shoot'] = "kill";
                    resObj['server_cell'] = ship_server[0]['cells'];
                    }
                    else{
                        //сервер просто попал в клетку корабля
                        resObj['server_shoot'] = "hit";
                        resObj['server_cell'] = hitCell_server["cell"];
                    }
                }
                else{//сервер не попал ни по 1 кораблю
                    resObj['server_shoot'] = "miss";
                    resObj['server_cell'] = hitCell_server["cell"];
                }

            }

                //если запрос с атакой по указанной клетке уже был, то берем состояние клетки из бд
                // выстрел сервера сделан не будет
            else{
                let a = await getCondition_sql(body["cell"], checkRepeat['id_field']);
                resObj = {
                    "shoot_result" : a,
                    "cell" : body["cell"]
                }
            }

            var resJSON = JSON.stringify(resObj)
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(resJSON);
        })();     
                            
                        }
            
            if(req.url ==='/numShips'){

                (async function () {   
                    let body = [];
            await req.on('data', function(chunk) {
                    body.push(chunk);
                    body = Buffer.concat(body).toString();
                    body = JSON.parse(body);//успешно полуили данные
                    
                log_sql('info', chunk + '/numShips');
            })
            
            let numUserShips = await numShips_sql(body["user"]);
            let resObj = {
                "numUserShips" : numUserShips
            }
            let serverName = body["user"] +'/server';
            resObj['NumServerShips'] = await numShips_sql(serverName);
            if((resObj['NumServerShips'] == 0) || (resObj['numUserShips'] == 0)){
                eraseGame(body["user"],serverName);//если у одного из игроков не осталось кораблей удаляем игру
                //при следующем запросе с выстрелом от этого игрока создастся новая игра
                //на клиенте пользователь не сможет продолжить игру не сбросив данные сессии
            }
            var resJSON = JSON.stringify(resObj)
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(resJSON);
                })()
            }

    }
        }
})
    function eraseGame(userName, serverName){
        let deleteUserGame = `DELETE FROM public.ship where id_field = (SELECT id_field from field where player = '`+userName+`');
        DELETE FROM public.field where player = '`+userName+`'; `;
        let deleteServerGame = `DELETE FROM public.ship where id_field = (SELECT id_field from field where player = '`+serverName+`');
        DELETE FROM public.field where player = '`+serverName+`'; `;
        db.any(deleteUserGame + deleteServerGame).then(data => {

        });
    }

    function log_sql(log_type, log_info){
        //функция сохранения логов об обращениях пользователей
        let insertLOG = `INSERT INTO public.log(
            type, log, change_date, create_date)
            VALUES ('`+log_type+`', '`+log_info+`', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`;
            db.any(insertLOG).then(data => {

            });
            }

    async function getHitCell_sql(servername){
        //функция получает массив клеток по которым сервер уже делал выстрел
        //и подбирает ячейку по которой будет производиться выстрел
        let selectHits = `SELECT hits, id_field FROM field where player = '`+ servername+`';`;
        let result;
        let id_field;
        await db.any(selectHits).then(data => {//получаем true если по клетке уже стреляли
            result = data[0]["hits"]['player'];
            id_field = data[0]["id_field"];
            })
            let possibleCell = getRandomIntInclusive(0,99);
            if(!isEmpty(result)){
                   while(result.indexOf(possibleCell) != -1){
                    possibleCell = (possibleCell + 1) % 100;//находим клетку по которой еще не стреляли
                }
                
            }
            return {
            "cell" :possibleCell,
            "id_field" : id_field
            };
    }


    async function numShips_sql(username){
    let selectCountShips = `SELECT COUNT(*) from ship where (id_field = (SELECT id_field from field where player = '`+username+`')) AND silk = false;`;
    let result;
    await db.any(selectCountShips).then(data1 => {//получаем true если по клетке уже стреляли
    result = data1[0]["count"];
    })
    return result;
}

    async function checkRepeat_sql(username,cell){
        let checkCorrectShoot = `SELECT (field.hits->'player')::jsonb @> '`+cell+`'::jsonb as result, id_field from field where player = '`+username+`';`;
    let result;
    await db.any(checkCorrectShoot).then(data1 => {//получаем true если по клетке уже стреляли
    result = data1[0];
    })
    return result;
}
    async function shoot_sql(username,cell, id_field){
        //если по клетке не стреляли тогда делаем выстрел и проверяем принадлежит ли указанная клетка какому-то из кораблей
        let shoot = `UPDATE field SET hits = jsonb_set(hits, '{player}', (hits->'player' || '`+cell+`' ::jsonb) ) 	WHERE player = '`+username+`';`;
        let getShip = `SELECT cells from ship where (id_field = `+id_field +`) AND ((ship.cells)::jsonb @> '`+cell+`'::jsonb );`;
        let result;    
        await db.any(shoot + getShip).then(data2 => {//data[0]['cells] - содержит все клетки корабля, проверить по каждой ли клетке производили выстрел
            result = data2;
        })
        return result;
    }

    async function checkSilk_sql(username, cells){
        let result;
        let checkKill = `SELECT (field.hits->'player')::jsonb @> '[`+cells+`]'::jsonb as result from field where player = '`+username+`';`;
        await db.any(checkKill).then(data => {
            result = data[0]['result'];
                })
        return result;
    }

    async function sink_sql(cell, id_field){

        let updateSilk = `UPDATE ship SET silk = true WHERE (id_field = `+id_field+`) AND (cells::jsonb @> '`+cell+`' ::jsonb);`;
                
        await db.any(updateSilk).then(data => {
                    
                })
                return true;
    }
    async function getCondition_sql(cell, id_field){
        let selectSink = `SELECT silk from ship where (id_field = `+id_field+`) AND (cells::jsonb @> '[`+cell+`]'::jsonb);`;
        let result;
        await db.any(selectSink).then(data => {
                   if(!isEmpty(data) ){
                        result = (data[0]['silk']) ? "kill" : "hit";
                   }
                   else{
                       result = "miss";
                   }
        })
        return result;

    }

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }



async function fillField_sql(id_field){
    let ship_arr = fillField();//расставляем кораблики на новом поле и формируем INSERT
    let ship_ins = `INSERT INTO public.ship(id_field, silk, cells) VALUES`;
    for(let i = 0; i < ship_arr.length;i++){
        ship_ins += `(` + id_field +`, false, '` +JSON.stringify(ship_arr[i])+ `' )`;
        ship_ins += (i == ship_arr.length-1) ? ';' : ', ';
    }
    let result;
    await db.any(ship_ins).then(data => {    
        result = true;
        })
        return result;
}
async function createNewField_sql(userName){

    let insObj = {
        "player" : []
    }; 
    let res_idField;
    await db.any(`INSERT INTO public.field(hits, player)VALUES ('` + JSON.stringify(insObj) + `'`+`, '`+userName+`') RETURNING id_field`).then(data2 => {
        res_idField = data2[0]["id_field"];
        }) 
        return res_idField;
}

async  function checkGameExist_sql(userName){//функция проверяет была ли игра с этим пользователем ранее, создаёт новую при отсутствии
let result;
     await db.any(`SELECT EXISTS(SELECT 1 FROM field WHERE player = '`+userName+`');`).then(data => {
             result = data[0]["exists"];      
              })
        return result;
        
    }
   
function calculateCell(arr, currCell, move, curLen, shipLen, resArr = []){
    //функция получает на вход размер корабля и направление в котором ей следует проверить возможно ли расположение корабля
    //если с указанной точки в указанном направлении возможно расположить корабль вернёт массив с номерами клеток корабля
    let resCell;
    if (move == 'up'){
        if(currCell >= 10){
            resCell = currCell - 10;
        }
        else{ return false; }
    }
    if (move == 'down'){
        if(currCell <=89){
            resCell = currCell +10;
        }
        else{ return false;}
    }
    if (move == 'left'){
        if( currCell % 10 != 0){
            resCell = currCell -1;
        }
        else { return false;}
    }
    if (move == 'right'){
        if (currCell % 10 != 9){
            resCell = currCell +1;
        }
        else{ return false;}
    }
    if(arr[resCell]==0){
        resArr[curLen-1] = resCell;
        if(curLen != shipLen){
            return calculateCell(arr,resCell,move,curLen+1,shipLen, resArr);
        }
        else{
            return resArr;
        }
    }
    else{
        return false;
    }
}

function wrap(arr, ship, i){//функция блокирует клетки вокруг корабля, так корабли не будут соприкасаться
    let up = (ship[i]>=10) ? true : false;//false - рассматриваемfя клетка корабл находится на границе поля 
    let down = (ship[i] <= 89) ? true : false;
    let left = (ship[i] % 10 != 0) ? true : false;
    let right = (ship[i] % 10 != 9) ? true : false;
    
    arr[ship[i]-10] = ((arr[ship[i]-10] == 0) && (up)) ? 2 : arr[ship[i]-10];
    arr[ship[i]-9] = ((arr[ship[i]-9] == 0) && (up) && (right)) ? 2 : arr[ship[i]-9];
    arr[ship[i]+1] = ((arr[ship[i]+1] == 0) && (right)) ? 2 : arr[ship[i]+1];
    arr[ship[i]+11] = ((arr[ship[i]+11] == 0) && (down) && (right)) ? 2 : arr[ship[i]+11];
    arr[ship[i]+10] = ((arr[ship[i]+10] == 0) && (down)) ? 2 : arr[ship[i]+10];
    arr[ship[i]+9] = ((arr[ship[i]+9] == 0) && (down) && (left)) ? 2 : arr[ship[i]+9];
    arr[ship[i]-1] = ((arr[ship[i]-1] == 0) && (left)) ? 2 : arr[ship[i]-1];
    arr[ship[i]-11] = ((arr[ship[i]-11] == 0) && (up) && (left)) ? 2 : arr[ship[i]-11];

    if(++i != ship.length){
        wrap(arr,ship,i);
    }
    else{
        return 'success';
    }

}

function createShip(arr, shipLen){//функция получает на вход игровое поле и размер корабля который необходиом разместить
    //случайно выбирает точку на поле и проверяет возможно ли в каком-то из направлений от этой точки расположить корабль
    //в результате работы в res хранятся номера клеток корабля
    let startPoint;
    let res = false;
    while (res == false){
        startPoint = getRandomIntInclusive(0,99);
        res = calculateCell(arr, startPoint, 'up', 1, shipLen);
        if(res == false){
            res = calculateCell(arr, startPoint, 'down', 1, shipLen);
        }
        if(res == false){
            res = calculateCell(arr, startPoint, 'left', 1, shipLen);
        }
        if(res == false){
            res = calculateCell(arr, startPoint, 'right', 1, shipLen);
        }
    }
    for(let i =0; i < shipLen;i++){
        arr[res[i]]=1;
    }
    wrap(arr,res,0);
  return res;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
  }
function fillField(){
    
    let arr = new Array();
    for(let i = 0; i < 100;i++){
        arr[i] = 0; 
    }
    let ship_arr = new Array();
    let shipNum = 0;
    ship_arr[shipNum++] = createShip(arr, 4);
    ship_arr[shipNum++] = createShip(arr, 3);
    ship_arr[shipNum++] = createShip(arr, 3);
    ship_arr[shipNum++] = createShip(arr, 2);
    ship_arr[shipNum++] = createShip(arr, 2);
    ship_arr[shipNum++] = createShip(arr, 2);
    ship_arr[shipNum++] = createShip(arr, 1);
    ship_arr[shipNum++] = createShip(arr, 1);
    ship_arr[shipNum++] = createShip(arr, 1);
    ship_arr[shipNum++] = createShip(arr, 1);
    
   return ship_arr;
}