<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md5 class="box2 mb-2">
      <panel title="Admin Login Form" class="elevation-12">
        <v-flex xs10 class="form mt-5">
          <v-flex xs12>
          <v-progress-linear
            :active="isUpdating"
            class="ma-0"
            color="green lighten-3"
            height="4"
            indeterminate
          ></v-progress-linear>
        </v-flex>
          <v-form v-model="valid" @submit.prevent="submit" ref="form" lazy-validation>
            <v-text-field
              prepend-icon="person"
              name="name"
              label="Enter User ID"
              v-model="login.aid"
              value=""
              :rules="textFieldRule"
              required
              hint="e.g: admin01"
              single-line
            >
          </v-text-field>
            <v-text-field
              prepend-icon="lock"
              :append-icon="visible ? 'visibility' : 'visibility_off'"
              @click:append="() => (visible = !visible)"
              :type="visible ? 'password' : 'text'"
              label="Enter Password"
              v-model="login.password"
              value=""
              :rules="textFieldRule"
              required
              single-line
            ></v-text-field>
            <v-card class="elevation-0">
              <v-card-text>
                <div class="danger-alert" v-html="error"></div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  class="submitBtn elevation-12 white--text"
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
  layout: 'admin',
  data () {
    return {
      login: {
        aid:'',
        password:'',
      },
      isUpdating: false,
      visible: true,
      error: null,
      background: 'red',
      valid: true,
      textFieldRule: [v => !!v || 'Name is required'],
    }
  },
  methods: {
    async submit () {
      try {
        if (this.$refs.form.validate()) {
          this.isUpdating = true
          const response = await this.$axios.$post('/a-login', this.login)
          // console.log(response);
          if (response.user) {
            setTimeout(() => {
              Cookie.set('tokenA', response.Atoken)
              this.$store.commit('setAToken', response.Atoken)
              this.$store.commit('setAdmin', response.user)
              this.isUpdating = false
              this.$router.push({
                name: 'admin-dashboard',
              })
            }, 500)
          }
        }
      } catch (err) {
        console.log(err);
        this.error = err.response.data.error
      }
    }
  },
  computed: {
    ...mapState([
      'isAdminLoggedIn'
    ])
  },

  watch: {
    isUpdating (val) {
      if (val) {
        setTimeout(() => (this.isUpdating = false), 2000)
      }
    }
  },
  async fetch ({ store, redirect }) {
    if (store.state.isAdminLoggedIn) {
      redirect('/admin/dashboard')
    }
  }
}
</script>

<style media="screen" scoped>
.form{
  margin: 0 auto;
}
.submitBtn {
  background-color: seagreen !important;
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