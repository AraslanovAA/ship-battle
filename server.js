const http = require('http');
const url = require('url');
const port = 3000
const host = 'localhost'
const fs = require('fs');

var pgp = require('pg-promise')();
var cn = {host: 'localhost', port: 5433, database: 'postgres', user: 'postgres', password: '1'};
var db = pgp(cn); 


const server = http.createServer();

server.on('request', (req, res) => {
    if (req.method=='GET'){
        console.log('откуда get запрос-то прилетел');
    }
    else{
        if (req.method=='POST'){
                        if(req.url ==='/shoot'){//спрашиваем у бд, а какие вообще есть производители у каждой категории

                            (async function () {
                            let body = [];
                        await req.on('data', function(chunk) {
                                body.push(chunk);
                                body = Buffer.concat(body).toString();
                                body = JSON.parse(body);//успешно полуили данные
                            
                           
                        })

                        let a = await checkGameExist(body["user"]);
                        if(a){//проверили что игра с данным пользователем уже идёт, либо создали для него записи в бд
                            console.log(a);
                            console.log('событие1111');
                        }
                        console.log(a);
                        console.log('событие1');

                        console.log('событие2');
                        let resObj = {"move" : false, "victory" : true};
                        var resJSON = JSON.stringify(resObj)
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(resJSON);
                    })();
                            
                            /* req.on('end',function() {
                                console.log('событие2');
                                    let resObj = {"move" : false, "victory" : true};
                                    var resJSON = JSON.stringify(resObj)
                                    res.writeHead(200, {'Content-Type': 'application/json'});
                                    res.end(resJSON);
                                    
                                }) */
                                
                            
                            
                        }
                        
    }
        }
})

server.listen(port,host, () =>{
    console.log('сервер работает')

});

async function createGame(userName){

    let insObj = {
        "player" : [],
        "server" : []
    }; 
    db.any(`INSERT INTO public.field(hits, player)VALUES ('` + JSON.stringify(insObj) + `'`+`, '`+userName+`') RETURNING id_field`).then(data2 => {
        console.log('id нового поля: ' + data2[0]["id_field"]);
                    
        let ship_arr = fillField();//расставляем кораблики на новом поле и формируем INSERT
        let ship_ins = `INSERT INTO public.ship(id_field, silk, cells) VALUES`;
        for(let i = 0; i < ship_arr.length;i++){
            ship_ins += `(` + data2[0]["id_field"] +`, false, '` +JSON.stringify(ship_arr[i])+ `' )`;
            ship_ins += (i == ship_arr.length-1) ? ';' : ', ';
        }
    
        db.any(ship_ins).then(data2 => {                 
            })
            return true;    
        }) 
}

async  function checkGameExist(userName){//функция проверяет была ли игра с этим пользователем ранее, создаёт новую при отсутствии

     await db.any(`SELECT EXISTS(SELECT 1 FROM field WHERE player = '`+userName+`');`).then(data => {
        console.log('Игра с пользователем ' + userName+' была создана ранее '+data[0]["exists"]);
        
        if(!data[0]["exists"]){//если новый пользователь создаём для него новое поле и расставляем корабли в ships
            createGame(userName);
        }
              })
      return true; 

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
    /* let str;
    for(let i = 0; i < 10;i++){
        str = '';
        for(let j = 0; j < 10;j++){
            str += arr[10*i+j] + ' ';
        }
        console.log(str);
    } */
   return ship_arr;
}