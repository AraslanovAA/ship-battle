<template>
<div>
    <img draggable = "false" id="ship5" @mouseup="mouseUp('ship5')" @mousedown="mousedown($event, 'ship5')" :src="getSrc('ship5')">
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
1.сделать пикчи ко всем кораблям горизон и вертикльно
2.реализовать движение пикч
3.добавить привязку к ближайшим углам сетки
4.анализировать на каких клетках стоит корабль
5. добавить анализатор, чтобы корабль не выставлялся за границы поля и корабли не соприкасались

*/
export default {
    name: 'setShips',
    data(){
        return{
            readyToClick : true,
            table : [],
            rotate : [false,false,false,false,false,false,false,false,false,false],
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

    getSrc(item_id){
        
        if(item_id == 'ship0'){
            return (this.rotate[0] ? this.ship4rotate : this.ship4)
        }
        if((item_id =='ship1')||(item_id =='ship2')){
            return (this.rotate[item_id[4]] ? this.ship3rotate : this.ship3)
        }
        if((item_id =='ship3')||(item_id =='ship4')||(item_id =='ship5')){
            return (this.rotate[item_id[4]] ? this.ship2rotate : this.ship2)
        }
        if((item_id =='ship6')||(item_id =='ship7')||(item_id =='ship8')||(item_id =='ship9')){
            return this.ship1
        }
    },
   mouseUp(item_id){
    this.readyToClick = true;
    console.log(item_id);
    //console.log('------------');
    //console.log(document.getElementById('t2').getBoundingClientRect().top + window.pageYOffset);
    //    console.log(document.getElementById('ship5').style.top);
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
        this.rotate[item_id[4]] = !this.rotate[item_id[4]];
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
    cursor: pointer;
 }

 td.water{
    background-image: url("https://sun9-67.userapi.com/impg/MApRVZoDHx00PA3mXKHcwBo4TFV-hnC0CUZ67g/gc0iSjaEURg.jpg?size=50x50&quality=96&sign=91c474df6653e582906397410fc3461b&type=album");
 }
</style>