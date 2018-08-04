<template>
  <v-layout row wrap>
    <v-flex xs12 sm6>
      <v-subheader v-text="'Multiple with persistent hint'"></v-subheader>
    </v-flex>
    <v-flex xs12 sm6>
      <v-select
        :items="books"
        :v-model="selecteds"
        label="Select"
        multiple
        max-height="400"
        hint="Pick your favorite states"
        persistent-hint
      ></v-select>
    </v-flex>
  </v-layout>
</template>
<script type="text/javascript">
export default {
  props: [
    'totalAmount',
    'items',
    'books',
    'selecteds',
    'purpose'
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
