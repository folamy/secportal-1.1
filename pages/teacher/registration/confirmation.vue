<template lang="html">
  <v-layout row wrap>
    <panel title="Registration Confirmation" class="panel">
      <v-flex xs9 class="center mb-3">
        <!-- <div class=" "> -->
          <span>Congratulations! <b>{{regData.ttitle}} {{regData.lastname}} {{regData.firstname }}</b> Your registration was successful <br>
            Please write down the following details for login purpose</span> <br>
          <span>Student ID: <b>{{regData.teacherID}}</b></span><br>
          <span>Password: <i>{{regData.teacherID}}</i></span><br>
          <span>Click <a class="login" href="#" @click="login">HERE </a> to login</span>
        <!-- </div> -->
      </v-flex>
    </panel>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faCoffee from '@fortawesome/fontawesome-free-solid/faCoffee'
export default {
  computed: mapState({
    regData: 'teacherRegData',
  }),
  middleware: 'showTeacherReg',
  methods: {
    async login () {
      const studId = this.$store.state.regData.studId
      const response = await this.$axios.post(`/t-login`, {studId: studId, password: studId})

      this.$store.commit('setTeacher', response.data.user)
      this.$store.commit('setToken', response.data.token)

      this.$router.push({
        name: 'student-dashboard',
      })
      this.$store.commit('setTeachRegData', null)
    }
  },
}
</script>

<style lang="css" scoped>
.center {
  text-align: justify;
  width: 90%;
  margin-bottom: 15px !important;
  margin: auto !important;
  

}
.login {
  text-decoration: underline;
  text-decoration-color: blue;
  font-style: italic;
  font-weight: bold;
}
</style>
