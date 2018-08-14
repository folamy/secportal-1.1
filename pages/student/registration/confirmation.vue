<template lang="html">
  <v-layout row wrap>
    <panel title="Registration Confirmation" class="panel">
      <v-flex xs9 class="center">
        <div class="center">
          <span>Congratulations! <b>{{regData.lastname}} {{regData.firstname }}</b> Your registration was successful <br>
            Please write down the following details for login purpose</span> <br>
          <span>Student ID: <b>{{regData.studId}}</b></span><br>
          <span>Password: <i>{{regData .studId}}</i></span><br>
          <span>Click <a class="login" href="#" @click="login">HERE </a> to login</span>
        </div>
      </v-flex>
    </panel>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faCoffee from '@fortawesome/fontawesome-free-solid/faCoffee'
export default {
  middleware: 'showStudentReg',
  computed: mapState({
    regData: 'studentRegData',
  }),

  methods: {
    async login () {
      const studId = this.regData.studId
      const response = await this.$axios.post(`/s-login`, {studId: studId, password: studId})

      this.$store.commit('setStudent', response.data.user)
      this.$store.commit('setSToken', response.data.Stoken)
      console.log(response);
      // this.$store.commit('setRegData', null)
      
      this.$router.push({
        name: 'student-dashboard',
      })
    }
  },
}
</script>

<style lang="css" scoped>
.center {
  text-align: justify;
  width: 90%;
  margin: auto;
}
.login {
  text-decoration: underline;
  text-decoration-color: blue;
  font-style: italic;
  font-weight: bold;
}
</style>
