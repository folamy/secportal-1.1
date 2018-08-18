<template>
  <v-layout row wrap align-center justify-center>
		<v-flex xs12 sm8 md5>
      <v-card>
        <v-card-media
          :src="error.statusCode === 404 ? '/images/error404.png' : '/images/error2.jpeg'"
          height="225"
        ></v-card-media>

        <v-card-title primary-title>
          <div style="margin: auto; text-align: center;">
            <h1 v-text="error.statusCode === 404 ? msg1 : msg2"></h1>
						<!-- <h1 v-else></h1> -->
						<div><h3>But we can redirect you to:</h3></div>
          </div>
        </v-card-title>

        <v-card-actions>
          <v-btn flat color="secport" to="/">Home</v-btn>
          <v-btn flat color="secport" to="/student">Student Portal</v-btn>
          <v-btn flat color="secport" to="/teacher">Teachers' Portal</v-btn>
          <v-btn flat color="secport" to="/admin">Admin</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
	</v-layout>
</template>

<script>
export default {
  data () {
    return {
      msg1: 'Oop! Page not found',
      msg2: 'A technical error has occurred'
    }
  },
  props: ['error'],
  layout: 'admin' // you can set a custom layout for the error page
}
</script>
<style scoped>

</style>