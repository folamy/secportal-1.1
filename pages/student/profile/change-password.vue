<template lang="html">
  <v-layout row wrap>
    <panel title="Change Password" class="panel">
      <v-flex xs6 class="change mt-3">
        <v-form @submit.prevent="onSubmit" v-model="valid" ref="form" lazy-validation>
          <v-text-field
            outline
            label="Current Password"
            :rules="textFieldRule"
            v-model="oldPass"
            type="password"
          ></v-text-field>
          <v-text-field
            outline
            label="New Password"
            :rules="textFieldRule"
            v-model="newPass1"
            type="password"
          ></v-text-field>
          <v-text-field
            outline
            label="Confirm New Password"
            :rules="textFieldRule"
            v-model="newPass2"
            type="password"
          ></v-text-field>
          <div class="danger-alert mt-0 mb-2" v-text="errors" ></div>
          <v-btn
            class="button"
            color="grey darken-2"
            type="submit"
            >
            change password
          </v-btn>
        </v-form>
      </v-flex>
    </panel>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import RegExp from 'xregexp'
import swal from 'sweetalert'
// import Promise from 'bluebird'
import bcrypt from 'bcrypt-nodejs'
export default {
  middleware: 'studentAuth',
  data () {
    return {
      textFieldRule: [v => !!v || 'Name is required'],
      valid: true,
      oldPass: '',
      newPass1: '',
      newPass2: '',
      errors: '',
      success: ''
      // student: this.$store.state.student
    }
  },

  computed: mapState({
    student: 'student',
    // studId: 'studId'
  }),

  methods: {
    async onSubmit () {
      if (this.$refs.form.validate()) {
        const id = this.student.studId
        const password = RegExp('^(?=.*[a-zA-Z])[a-zA-Z0-9]{6,8}$')

        if (!bcrypt.compareSync(this.oldPass.toLowerCase(), this.student.password)) {
          this.errors = 'Current password is incorrect'
          swal({
            title: "Error!",
            text: this.errors,
            icon: "error",
            button: "Try again",
          })
          return
        }

        if (this.newPass1 !== this.newPass2) {
          this.errors = 'Passwords do not match'
          swal({
            title: "Error!",
            text: this.errors,
            icon: "error",
            button: "Try again",
          })
          return
        } else {
          this.errors = ''
        }

        if (!password.test(this.newPass1)) {
          this.errors = 'Passwords must be minimum of 6 and maximum 8 alphanumeric characters e.g (abc123)'
          swal({
            title: "Error!",
            text: this.errors,
            icon: "error",
            button: "Try again",
          })
          return
        } else {
          this.errors = ''
        }

        const passwords = {
          oldPass: this.oldPass,
          newPass: this.newPass2,
        }
        const response = await this.$axios.post(`/get-password/${id}`, passwords)

        if (response.status === 200) {
          this.success = `Your password has been changed successfully`
          swal({
            title: "Success!",
            text: this.success,
            icon: "success",
            button: "Okay",
          })
          .then((redirect) => {
            this.$router.push({
              name: 'student-profile',
            })
          });
        }
      }
    }
  },

  created () {

  }
}
</script>

<style lang="css" scoped>
.change {
  margin: auto;
}
.button {
  margin: 0 auto !important;
}
</style>
