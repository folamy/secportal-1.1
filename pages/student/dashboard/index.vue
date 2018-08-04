<template lang="html">
  <panel title="Dashboard" class="panel">
    <v-layout row wrap ml-4 mt-3 class="">
      <v-flex xs8 class="mr-5">
        <p>
          Welcome ! You can use the <b>dashboard</b> at
          the left side of the screen to process your registration,
          payments, and checking of results
        </p>
      </v-flex>
      <v-flex class="">
        <img
        :src="'/uploads/students/finals/' +  profilePix"
        alt=""
        class="profile"
        align-center>
      </v-flex>
    </v-layout>
  </panel>
</template>

<script>
import Cookie from 'js-cookie'
import { mapState } from 'vuex'
export default {
  computed: mapState({
    profilePix:  'Spassport',
    studentData: 'student'
  }),
  middleware: 'studentAuth',
  async created () {
    //
  }
}

</script>

<style scoped>
.profile{
  width: 150px;
  height: 150px;

  /* float: right; */
}
</style>
