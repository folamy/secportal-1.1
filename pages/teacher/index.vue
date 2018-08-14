<template>
  <v-layout row wrap class>
    <v-flex xs12 sm8 md6 class="box1 ml-4 mb-2 mr-5">
      <h2>Welcome to SecPortal</h2>
      <v-divider class="mb-3"/>
      <p>
        Welcome to SecPortal! We recommend that you login to access your portal
      </p>
    </v-flex>

    <v-flex v-if="!isTeacherLoggedIn" xs12 sm8 md5 class="box2 mb-2">
      <panel title="Teachers' Login" >
        <v-flex xs10 class="form mt-5">
          <v-flex xs12>
            <v-progress-linear
              :active="isUpdating"
              class="mb-4"
              color="green lighten-3"
              height="4"
              indeterminate
            >
            </v-progress-linear>
          </v-flex>
          <v-form v-model="valid" @submit.prevent="submit" ref="form" lazy-validation>
            <v-text-field
              outline
              label="Enter teacher ID"
              v-model="login.teacherID"
              :rules="textFieldRule"
              required
              hint="e.g: TID000000"
              single-line
            >
          </v-text-field>
            <v-text-field
              outline
              :append-icon="visible ? 'visibility' : 'visibility_off'"
              @click:append="() => (visible = !visible)"
              :type="visible ? 'password' : 'text'"
              label="Enter Password"
              v-model="login.password"
              value=""
              :rules="textFieldRule"
              required
              hint="By default, password is the same as Student ID but can be change from dashbord once logged in"
              single-line
            ></v-text-field>

            <div class="danger-alert" v-html="error"></div>

            <v-btn
              dark
              type="submit"
              >
              Login
            </v-btn>
          </v-form>
        </v-flex>
      </panel>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import Cookie from 'js-cookie'
// import Teacher from '~/layouts/teacher'
export default {
  layout: 'teacher',
  data () {
    return {
      login: {
        teacherID:'',
        password:'',
      },
      visible: true,
      error: null,
      background: 'red',
      valid: true,
      textFieldRule: [v => !!v || 'Name is required'],
      isUpdating: false
    }
  },
  methods: {
    async submit (event) {
      try {
        if(event) event.preventDefault()
        if (this.$refs.form.validate()) {
          this.isUpdating = true
          const response = await this.$axios.$post('/t-login', this.login)
          console.log(response)

          Cookie.set('tokenT', response.Ttoken)
          this.$store.commit('setTToken', response.Ttoken) // mutating to store for client rendering
          this.$store.commit('setTeacher', response.user) // mutating to store for client rendering
          this.$router.push({
            name: 'teacher-profile',
          })
        }
      } catch (err) {
        if (err) {
          setTimeout(() => {
            // console.log(err);
            this.error = err.response.data.error
          }, 1000)
        }
        
      }
    }
  },

  computed: {
    ...mapState([
      'isTeacherLoggedIn'
    ])
  },

  watch: {
    isUpdating (val) {
      if (val) {
        setTimeout(() => (this.isUpdating = !this.isUpdating), 2000)
      }
    }
  },

  async fetch ({ store, redirect }) {
    if (store.state.isTeacherLoggedIn) {
      redirect('/teacher/profile')
    }
  }
}
</script>

<style media="screen" scoped>
  .form{
    margin: 0 auto;
  }
  @media  only screen and (min-width:320px) and (max-width:768px) {
  .box1 {
    margin: 0 auto !important;
  }
}
  .danger-alert {
    color: red;
    font-style: oblique;
    /* font-weight: bold; */
  }
</style>
