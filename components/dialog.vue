<template>
  <v-layout row justify-center >
    <v-dialog
      persistent
      v-model="dialog"
      max-width="250"
    >
      <v-card>
        <v-card-title class="headline actionHead">{{title}}</v-card-title>
        <v-card-text class="actionInfo">
          {{text}}
        </v-card-text>

        <v-card-actions text-xs-center>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            flat="flat"
            @click="disagree"
          >
            Disagree
          </v-btn>

          <v-btn
            color="green darken-1"
            flat="flat"
            @click="agreeftn"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
	props: [
		'title',
		'text',
		'disagree',
		'agreeftn',
		'dialog'
  ]
}
</script>

<style>
.actionInfo {
  text-align: justify
}
.actionHead {
  color: red;
}
</style>
