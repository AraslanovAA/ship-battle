<template>
<div>
    <div class="shipContainer">
    <img  v-for="(pic, picID) in ships" :key="picID" :class="pic.class" :id="pic.id"  :src="getSrc(pic['id'])" draggable = "false" @mouseup="mouseUp(pic['id'])" @mousedown="mousedown($event, pic['id'])">
    </div>
    <table id = 't1'>
    <caption>Перетащите корабли на поле</caption>
    <tbody id ='t2'>
      <tr v-for="(row,indexRow) in table" :key="indexRow">
        <td v-for="(cell,indElemInRow) in row" :id="cell" :key="indElemInRow" class="water"> </td>
      </tr>
    </tbody>
  </table>
  </div>
</template>


<script>
/*
TODO list:
4.анализировать на каких клетках стоит корабль
5. добавить анализатор, чтобы корабль не выставлялся за границы поля и корабли не соприкасались
*/
export default {
    name: 'setShips',
    data(){
        return{
            readyToClick : true,
            ships : [
                {rotate : false, length : 4, id : 'ship0', coords : null, class : 'shipIn'},
                {rotate : false, length : 3, id : 'ship1', coords : null, class : 'shipIn'},
                {rotate : false, length : 3, id : 'ship2', coords : null, class : 'shipIn'},
                {rotate : false, length : 2, id : 'ship3', coords : null, class : 'shipIn'},
                {rotate : false, length : 2, id : 'ship4', coords : null, class : 'shipIn'},
                {rotate : false, length : 2, id : 'ship5', coords : null, class : 'shipIn'},
                {rotate : false, length : 1, id : 'ship6', coords : null, class : 'shipIn'},
                {rotate : false, length : 1, id : 'ship7', coords : null, class : 'shipIn'},
                {rotate : false, length : 1, id : 'ship8', coords : null, class : 'shipIn'},
                {rotate : false, length : 1, id : 'ship9', coords : null, class : 'shipIn'},
            ],
            table : [],
            ship4 : "https://sun9-50.userapi.com/impg/AWVru0W51zoy51QGaukz1fUSfapkd7CeJksMfw/tmEltqbic-I.jpg?size=50x200&quality=96&sign=defa0353f12902e5c4b97ba4d6388620&type=album",
            ship4rotate : "https://sun9-43.userapi.com/impg/7GClZHcGeT6pZwBOVYMTND5KrQEEaT5jUcTspw/q-cSP4dNtPI.jpg?size=200x50&quality=96&sign=e506fb20a0057dbb71708aefcbad7cff&type=album",
            ship3 : "https://sun9-11.userapi.com/impg/g208K4Kb6q8qQ3lQfzcSCGj7-PsExHZFTjlM4Q/_wPTH--Odgg.jpg?size=50x150&quality=96&sign=a714f814b6506b4d52630fd67eb5f852&type=album",
            ship3rotate : "https://sun9-64.userapi.com/impg/SgXv7NvkYHgdGRQeC0HJLFZZEmat0fYeOrQNrQ/jNudGZsRI8Y.jpg?size=150x50&quality=96&sign=c9536812e8eba782bea25953745e8cf6&type=album",
            ship2 : "https://sun9-17.userapi.com/impg/2JV3ncESVf2DcjRMtsKa8sNLeyopK7A72M7-Rw/CGM9mWzKNn8.jpg?size=50x100&quality=96&sign=273c2cd8ee2a1deb040f11e8404a17a0&type=album",
            ship2rotate : "https://sun9-50.userapi.com/impg/-picZSuXH1_Nwtkg24f22nlIfbYVkc5AkFeBEA/rdJvzIfQb5o.jpg?size=100x50&quality=96&sign=c444d4dfd76512c43e72273f8609f4b4&type=album",
            ship1 : "https://sun9-2.userapi.com/impg/tGwjGmItwVOVDiOiFs-TREN9NiVZo7PNabO-cw/-i0cSgUI1qY.jpg?size=50x50&quality=96&sign=3ea4b360e41ff5532d5b45d3e118be8d&type=album"
        }
    },
    created(){
    for(let i = 0; i < 10;i++){
      let td = [];
      for(let j = 0; j< 10;j++){
        td.push('cell' +(10*i+j));
      }
      this.table.push(td);
    }
        console.log(this.table);
    },
    methods :{

    getSrc(item_id){//я там менять начал надо продлжитб
        console.log('getSrc:');
        console.log(item_id);
        for(let i=0;i < this.ships.length; i++){
            if(this.ships[i]['id'] == item_id){
                if(this.ships[i]['length'] == 4){
                    return (this.ships[i]['rotate'] ? this.ship4rotate : this.ship4);
                }
                if(this.ships[i]['length'] == 3){
                    return (this.ships[i]['rotate'] ? this.ship3rotate : this.ship3);
                }
                if(this.ships[i]['length'] == 2){
                    return (this.ships[i]['rotate'] ? this.ship2rotate : this.ship2);
                }
                if(this.ships[i]['length'] == 1){
                    return  this.ship1;
                }
            }
        }
        
    },
    checkCorrect(){//TODO проверка на корректность постановки
        
    },
   mouseUp(item_id){
    this.readyToClick = true;
    console.log(item_id);
    let y0 = document.getElementById('t2').getBoundingClientRect().top + window.pageYOffset;//начальные координаты таблицы
    let x0 = document.getElementById('t2').getBoundingClientRect().left + window.pageXOffset;
    let x1 = document.getElementById(item_id).getBoundingClientRect().left + window.pageXOffset;//координаты отпускания элемента
    let y1 = document.getElementById(item_id).getBoundingClientRect().top + window.pageYOffset;
    let numX = Math.round((x1-x0)/50);
    let numY = Math.round((y1-y0)/50);
    console.log(numX);
    console.log(numY);
    let idInArr;
    for (let i=0;i< this.ships.length;i++){
                if(this.ships[i]['id'] == item_id){ idInArr = i;}
            }

    if ( (numX >= 0)&&(numX <10)&&(numY >= 0) &&(numY < 10)){
        this.ships[idInArr]['class'] = 'shipOut';
        document.getElementById(item_id).style.left = x0 + numX*50 + 'px';
        document.getElementById(item_id).style.top = y0 + numY*50 + 'px';
        
    }
        
   },
    mousedown($event, item_id){
        let curShip = document.getElementById(item_id);
        let shiftX = $event.clientX - curShip.getBoundingClientRect().left;
    let shiftY = $event.clientY - curShip.getBoundingClientRect().top;
    function moveAt(pageX, pageY) {
        curShip.style.left = pageX - shiftX + 'px';
        curShip.style.top = pageY - shiftY + 'px';
    }
  
    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }
    
        if (this.readyToClick){
            this.readyToClick = false;
        if($event.button != 0){
            for (let i=0;i< this.ships.length;i++){
                if(this.ships[i]['id'] == item_id){
                    this.ships[i]['rotate'] = !this.ships[i]['rotate'];
                }
            }
         this.readyToClick = true;   
        return;
        }
        
       curShip.style.position = 'absolute';
    curShip.style.zIndex = 1000;
       document.body.append(curShip);
        moveAt($event.pageX, $event.pageY);
  
    
    
      document.addEventListener('mousemove', onMouseMove);
      curShip.onmouseup = function() {
          
      this.readyToClick = true;    
      
      document.removeEventListener('mousemove', onMouseMove);
      curShip.onmouseup = null;
    };
        
        }
        },
    
    }
}
</script>

<style scoped>
.shipContainer {
  min-height: 220px;
  background-color: aqua;
  
}
.shipIn {
  padding: 0 5px;
  cursor: pointer;
  vertical-align: top;
}
.shipOut{
    cursor: pointer;
}
table {
    border-collapse: collapse;
    /*убираем пустые промежутки между ячейками*/
    border: 1px solid grey;
    /*устанавливаем для таблицы внешнюю границу серого цвета толщиной 1px*/
    width: 500px;
    height: 500px;
    margin-right: 10px;
    
 }
 caption {
 
    text-align: left;
    padding: 10px 0;
    font-size: 14px;
 }
 td {
    border: 1px dotted black;
    background-repeat: no-repeat;
    
 }

 td.water{
    background-image: url("https://sun9-67.userapi.com/impg/MApRVZoDHx00PA3mXKHcwBo4TFV-hnC0CUZ67g/gc0iSjaEURg.jpg?size=50x50&quality=96&sign=91c474df6653e582906397410fc3461b&type=album");
 }
</style>