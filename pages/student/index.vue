<template>
  <v-layout row wrap class>
    <v-flex xs12 sm8 md6 class="box1 ml-4 mb-2 mr-5" centered>
      <h2>Welcome to SecPortal</h2>
      <v-divider class="mb-3"/>
      <p>
        Welcome to SecPortal! We recommend that you login to access your portal
      </p>

    </v-flex>

    <v-flex v-if="!isStudentLoggedIn" xs12 sm8 md5 class="box2 mb-2">
      <panel title="Student Login" >
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
              name="name"
              label="Enter studentID"
              v-model="login.studId"
              value=""
              :rules="textFieldRule"
              required
              hint="e.g: SCH000000"
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
            <v-card class="elevation-0">
              <v-card-text>
                <div class="danger-alert" v-html="error"></div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  class="submitBtn"
                  color="grey darken-2"
                  type="submit"
                  >
                  Login
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-flex>
      </panel>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import Cookie from 'js-cookie'

export default {
  data () {
    return {
      login: {
        studId:'',
        password:'',
      },
      visible: true,
      error: null,
      background: 'red',
      valid: true,
      textFieldRule: [v => !!v || 'This field is required'],
      isUpdating: false
    }
  },
  methods: {
    async submit () {
      try {
        if (this.$refs.form.validate()) {
          this.isUpdating = true
          const response = await this.$axios.$post('/s-login', this.login)
          console.log(response);
          Cookie.set('tokenS', response.Stoken)
          this.$store.commit('setSToken', response.Stoken)
          this.$store.commit('setStudent', response.user)
          this.$router.push({
            name: 'student-dashboard',
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

  watch: {
    isUpdating (val) {
      if (val) {
        setTimeout(() => (this.isUpdating = !this.isUpdating), 2000)
      }
    }
  },

  computed: {
    ...mapState([
      'isStudentLoggedIn'
    ])
  },
  async fetch ({ store, redirect }) {
    if (store.state.isStudentLoggedIn) {
      redirect('/student/dashboard')
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
