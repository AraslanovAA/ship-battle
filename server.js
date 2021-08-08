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
        console.log('вот тут получается обрабатываем');
    }
})

server.listen(port,host, () =>{
    console.log('сервер работает')
    createGame('Anton2');
});

function createGame(userName){
    fillField();
}


function calculateCell(arr, currCell, move, curLen, shipLen, resArr = []){
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

function createShip(arr, shipLen){
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
    
    createShip(arr, 4);
    createShip(arr, 3);
    createShip(arr, 3);
    createShip(arr, 2);
    createShip(arr, 2);
    createShip(arr, 2);
    createShip(arr, 1);
    createShip(arr, 1);
    createShip(arr, 1);
    createShip(arr, 1);
    let str;
    for(let i = 0; i < 10;i++){
        str = '';
        for(let j = 0; j < 10;j++){
            str += arr[10*i+j] + ' ';
        }
        console.log(str);
    }
   
}