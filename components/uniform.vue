<template>
  <v-flex xs9 class="tableItems mt-2">
    <v-data-table
     :headers="headers"
     :items="schoolItems"
     hide-actions
     class="elevation-1"
    >
    <template slot="items" slot-scope="props">
      <td>{{ props.item.name }}</td>
      <td class="text-xs-right">{{ props.item.class }}</td>
      <td class="text-xs-right">{{ props.item.price }}</td>
    </template>
    </v-data-table>
    <v-flex class="total">
      <span class="label">Total </span> <span class="amount">N{{totalAmount}}</span>
    </v-flex><br>
    <v-divider></v-divider>
  </v-flex>

</template>
<script type="text/javascript">
export default {
  props: [
    'totalAmount',
    'headers',
    'schoolItems'
  ]
}
</script>
<style media="screen" scoped>
.total {
  width: 250px;
  border: 1px solid grey;
  float: right !important;
}
.total .label{
  margin-left: 20px;
  font-weight: bold;
  float: left !important;
}
.total .amount{
  /* width: 250px; */
  /* border: 1px solid #000; */
  margin-right: 20px;
  font-weight: bold;
  float: right !important;
}
</style>
