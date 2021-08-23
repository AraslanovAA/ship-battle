<template>
  <div>
    <div v-if="endGame" >{{victorySTR}}</div>
  <table>
    <caption>кораблей противника: {{enemyShips}}</caption>
    <tbody>
      <tr v-for="(row,indexRow) in enemyTable" :key="indexRow">
        <td v-for="(cell,indElemInRow) in row" :key="indElemInRow" @click="shoot(indexRow,indElemInRow)" v-bind:class="cell"> </td>
      </tr>
    </tbody>
  </table>
  </div>
</template>

<script>

export default {
  name: 'enemyTable',
    data(){
    return {
    endGame : false,
    victorySTR : '',
    enemyShips : 10,
    enemyTable : [],
    userShips : 10,
    userTable : []
    }
  },
  created(){
    for(let i = 0; i < 10;i++){
      let td = []
      for(let j = 0; j< 10;j++){
        td.push('water');
      }
      this.enemyTable.push(td);
    }
      if (this.getCookie('userName') == ''){
        document.cookie = 'userName=' + Date.now();
      }
  },
  methods:{
    resetGame(){
      this.endGame = false;
      for(let i = 0; i < 10;i++){
      
      for(let j = 0; j< 10;j++){
        this.enemyTable[i][j] = 'water';
      }
      
    }
    },
    async shoot(indexRow,indexElem){
        if(this.endGame == false){
         let result = await fetch('http://localhost:3000/shoot', {
           method : 'POST',
           header : {
             'Content-Type' : 'application/json'
           },
         
           body : JSON.stringify({
           user : this.getCookie('userName'),
           cell : 10*indexRow + indexElem
         })
        
         });
         let resultJSON = await result.json();
         this.enemyTable[indexRow][indexElem] = resultJSON['shoot_result'];
         if(resultJSON['shoot_result'] == 'kill'){
           for(let i =0; i< resultJSON['cell'].length;i++){
             let cellNum = resultJSON['cell'][i];
             this.enemyTable[Math.trunc(cellNum/10)][cellNum % 10] = resultJSON['shoot_result']
           }
            await this.getNumShips();
         }  
         console.log(resultJSON);
        }
        else{
          this.resetGame();
        }
    },
    async getNumShips(){
      let result = await fetch('http://localhost:3000/numShips', {
           method : 'POST',
           header : {
             'Content-Type' : 'application/json'
           },
         
           body : JSON.stringify({
           user : this.getCookie('userName')
         })
         });
           let resultJSON = await result.json();
           console.log('getNumShips resultJSON:');
           console.log(resultJSON);
           this.enemyShips = resultJSON['numUserShips'];
           this.userShips = resultJSON['numServerShips'];
           this.endGame = ((this.enemyShips == 0) || (this.userShips == 0)) ? true : false;
           this.victorySTR = (this.endGame && (this.enemyShips ==0)) ? 'Вы выиграли' : 'Вы проиграли';

    }     
  ,
     getCookie(name) {
     var cookieString = document.cookie;
            var cookieParsed = cookieString.split(';')
            let hash2 = '';
            for(let i =0;i<cookieParsed.length;i++){
                if(cookieParsed[i].indexOf(name)!==-1){
                    var parsingArr = cookieParsed[i].split('=')
                    hash2 = parsingArr[1]
                }
            }
     return hash2;
     },
    
imageName(indexRow,indexElem){
      if(this.enemyTable[indexRow][indexElem]=='water'){
        return "https://sun9-67.userapi.com/impg/MApRVZoDHx00PA3mXKHcwBo4TFV-hnC0CUZ67g/gc0iSjaEURg.jpg?size=50x50&quality=96&sign=91c474df6653e582906397410fc3461b&type=album"
      }
      if(this.enemyTable[indexRow][indexElem]=='hit'){
        return "https://sun9-17.userapi.com/impg/R8VNydG0NJ1EVPBa9J_z3cBUUoncYD7PkCpcmQ/3ewQ3Ls0W-c.jpg?size=50x50&quality=96&sign=287ba4e5d015b73390e740d8fffa6e89&type=album"
      }
      if(this.enemyTable[indexRow][indexElem]=='miss'){
        return "https://sun1-94.userapi.com/impg/BXh1v-xfQETuA-Rk-7L81tgdmz5QOuqz4kcMYw/QQGrJrs86t4.jpg?size=50x50&quality=96&sign=825993afd5f6b32bdc80f4e79e033fb0&type=album"
      }
      if(this.enemyTable[indexRow][indexElem]=='kill'){
        return "https://sun9-2.userapi.com/impg/iXB9DWEAbORikjl4JNgddCQKAN2jNlGqqYWZkw/omEBG_UT7As.jpg?size=50x50&quality=96&sign=9e8857916f6227aa47d96c69cd5615d8&type=album"
      }
      else{
        return "@/assets/kill.png"
      }
    }
  }
}
</script>

<style scoped>
 .container{

   display: flex;

   flex-direction: row;

   justify-content: flex-start;

}
form{
   
   margin-right: 10px;
}
table {
    border-collapse: collapse;
    /*убираем пустые промежутки между ячейками*/
    border: 1px solid grey;
    /*устанавливаем для таблицы внешнюю границу серого цвета толщиной 1px*/
    width: 500px;
    height: 500px;
    
    
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
 td.miss{
    background-image: url("https://sun1-94.userapi.com/impg/BXh1v-xfQETuA-Rk-7L81tgdmz5QOuqz4kcMYw/QQGrJrs86t4.jpg?size=50x50&quality=96&sign=825993afd5f6b32bdc80f4e79e033fb0&type=album");
 }
 td.hit{
    background-image: url("https://sun9-17.userapi.com/impg/R8VNydG0NJ1EVPBa9J_z3cBUUoncYD7PkCpcmQ/3ewQ3Ls0W-c.jpg?size=50x50&quality=96&sign=287ba4e5d015b73390e740d8fffa6e89&type=album");
 }
 td.kill{
    background-image: url("https://sun9-2.userapi.com/impg/iXB9DWEAbORikjl4JNgddCQKAN2jNlGqqYWZkw/omEBG_UT7As.jpg?size=50x50&quality=96&sign=9e8857916f6227aa47d96c69cd5615d8&type=album");
 }

</style>
