<template>
  
  <table>
    <caption>кораблей противника: {{enemyShips}}</caption>
    <tbody>
      <tr v-for="(row,indexRow) in enemyTable" :key="indexRow">
        <td v-for="(cell,indElemInRow) in row" :key="indElemInRow" @click="change(indexRow,indElemInRow)">{{cell}} </td>
      </tr>
    </tbody>
  </table>
  
</template>

<script>
export default {
  name: 'enemyTable',
    data(){
    return {
    enemyShips : 10,
    enemyTable : []
    }
  },
  created(){//
    for(let i = 0; i < 10;i++){
      let td = []
      for(let j = 0; j< 10;j++){
        td.push('water');
      }
      this.enemyTable.push(td);
    }
     
  },
  methods:{
    change(indexRow,indexElem){
      this.enemyTable[indexRow][indexElem]='hit';
    }
  }
}
</script>


