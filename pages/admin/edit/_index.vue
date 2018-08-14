<template>
  <v-layout row wrap>
    <panel :title="title" class="panel" justify-center>
      <v-flex xs9 class="register">
        <h1 class="title mt-2 mb-3">Edit Uses's Details</h1>
        <v-form  @submit.prevent="saveInfo" v-model="valid" ref="form" lazy-validation>
          <v-select
            v-if="userData.teacherID"
            outline
            :items="titles"
            v-model="userData.ttitle"
            label="Title"
            item-value="text"
            :rules="[v => !!v || 'Title is required']"
            required
          ></v-select>
          <v-text-field
            outline
            label="Surname"
            v-model="userData.lastname"
            :rules="textFieldRule"
            required
          >
        </v-text-field>
          <v-text-field
            outline
            label="First Name"
            v-model="userData.firstname"
            value=""
            :rules="textFieldRule"
            required
          ></v-text-field>
          <v-text-field
            outline
            label="Other Names"
            v-model="userData.othername"
            value=""
          ></v-text-field>

          <v-radio-group
            outline
            v-model="userData.gender"
            label="Your gender"
            row
            :rules="[v => !!v || 'Select your gender']"
            required
            >
            <v-radio class="mt-2" label="Male" value="Male" ></v-radio>
            <v-radio class="mt-2" label="Female" value="Female"></v-radio>
          </v-radio-group>

          <!-- <datepicker :dob.sync="userData.dob"/> -->
          <v-menu
            outline
            ref="menu"
            lazy
            :close-on-content-click="false"
            v-model="menu"
            transition="scale-transition"
            offset-y
            full-width
            :nudge-right="40"
            min-width="290px"
          >
            <v-text-field
              outline
              slot="activator"
              label="Date of Birth"
              v-model="userData.dob"
              append-icon="event"
              readonly
              :rules="textFieldRule"
              required
            ></v-text-field>
            <v-date-picker
              header-color="secport"
              autosave
              ref="picker"
              v-model="userData.dob"
              @change="save"
              min="1950-01-01"
              :max="new Date().toISOString().substr(0, 10)"
            ></v-date-picker>
          </v-menu>
          <!-- <datepicker :dob.sync="userData.dob"/> -->
          <v-select
            outline
            v-model="userData.stateOrigin"
            :items="Ngstate"
            label="Select State"
            item-value="stateID"
            item-text="name"
            required
            >
          </v-select>

          <v-select
            outline
            v-model="userData.localGov"
            :items="Nglga"
            label="Select Local Government"
            required
            item-value="name"
            item-text="name"
            >
          </v-select>
          <v-select
            v-if="userData.studId"
            outline
            v-model="userData.classLevel"
            :items="classLevel"
            :rules="[v => !!v || 'Select a class']"
            label="Select a class"
            item-text="name"
            item-value="classId"
            required
            @input="SSclass()"
            >
          </v-select>
          <div class="" v-if="showSubClass">
            <v-select
              outline
              v-model="userData.subClass"
              :items="subClass"
              :rules="[v => !!v || 'State of origin is required']"
              label="Select one SS Class"
              item-value="name"
              item-text="name"
              required
              >
            </v-select>
          </div>
          <h1 v-if="userData.studId" class="title mt-2 mb-3">Parents' Details</h1>
          <v-text-field
            v-if="userData.studId"
            outline
            append-icon="contacts"
            label="Guardian's Names"
            v-model="userData.guardian"
            value=""
            :rules="textFieldRule"
            required
          ></v-text-field>
          <v-text-field
            outline
            append-icon="contact_phone"
            label="Personal Phone number"
            v-model="userData.phoneNumber"
            :value="states"
            :rules="phoneReg"
            required
          ></v-text-field>

          <v-textarea
            outline
            append-icon="home"
            multi-line
            Reverses the input orientation
            label="Home Address"
            v-model="userData.homeAddress"
            value=""
            :rules="textFieldRule"
            required
          ></v-textarea>
          <v-text-field
            outline
            append-icon="contact_mail"
            label="Email Address"
            v-model="userData.email"
            value=""
            :rules="EmailRules"
            required
          ></v-text-field>

        <h1 v-if="userData.teacherID" class="title mt-2 mb-3">Next of Kin</h1>
          <v-text-field
            v-if="userData.teacherID"
            outline
            append-icon="contacts"
            label="Next of Kin's Name"
            v-model="userData.nextOfKin"
            value=""
            :rules="textFieldRule"
            required
          ></v-text-field>
          <v-textarea
            v-if="userData.teacherID"
            outline
            append-icon="home"
            multi-line
            label="Home Address"
            v-model="userData.nextOfKinHome"
            value=""
            :rules="textFieldRule"
            required
          ></v-textarea>
          <v-text-field
            v-if="userData.teacherID"
            outline
            append-icon="contact_phone"
            label="Next of Kin Phone number"
            v-model="userData.nextOfKinPhone"
            value=""
            :rules="phoneReg"
            required
          ></v-text-field>
          <v-checkbox
            v-model="agree"
            :rules="[v => !!v || 'You must agree to continue!']"
            label="I agree to all information supplied above"
            required
          ></v-checkbox>
          <v-divider></v-divider>
          <div class="danger-alert" v-html="error"></div>
          <!-- <v-btn
            color="red darken-2"
            @click="clear">
            clear
          </v-btn> -->
          <v-btn
            class=""
            type="submit"
          >
            Continue
          </v-btn>
          <!-- date picker -->
        </v-form>
      </v-flex>
    </panel>
	</v-layout>
</template>

<script>
import { mapState } from "vuex";
export default {
  layout: 'admin',
  middleware: 'adminAuth',
  data () {
    return {
      title: '',
      states: '',
      valid: true,
      userData: '',
      originalData: '',

      titles: [
        {text: 'Mr.'},
        {text: 'Mrs.'},
        {text: 'Miss.'}
      ],

      error: null,
      showSubClass: false,
      agree: false,
      Ngstate: [],
      Nglga: [],
      classLevel: [],
      subClass: [],
      menu: false,

      // form vFormTemplateValidation
      phoneReg: [
        v => !!v || 'Name is required',
        v => /^\d{11}$/.test(v) || 'Invalid Phone Number'
      ],
      textFieldRule: [v => !!v || 'Name is required'],
      EmailRules: [
        v => !!v || 'E-mail is required',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
    }
  },

  watch: {
    menu (val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },

  methods: {
    save (date) {
      this.$refs.menu.save(date)
    },

    clear () {
      this.$refs.form.reset()
      this.error = null
    },

    async saveInfo (event) {
      try {

        if (this.$refs.form.validate()) {
          // console.log(this.userData);
          await this.$axios.post('/save-edit', this.userData)
          .then(res => {
            console.log(res);
            const id = this.userData.teacherId || this.userData.studId
            this.$router.push({
              name: 'admin-users',
              params: `${id}`
            })
          })
        }

      } catch (err) {
        console.log(err);
        this.error = err.response.data.error
      }
    },

    async changeState () {
      const lga = await this.$axios.$get('/lga/' + this.userData.stateOrigin)
      this.Nglga = []
      for (var i = 0; i < lga.length; i++) {
        lga[i].text = lga[i].name
        this.Nglga.push(lga[i])
      }
    },

    async SSclass () {
      if (this.userData.classLevel > 3) {
        this.showSubClass = true
        this.subClass = []
        this.subClass = await this.$axios.$get('/ssclass')
      } else {
        this.showSubClass = false
        this.userData.subClass = ''
      }
    }

  },

  async created () {
    const states =  await this.$axios.$get('/state')
    this.Ngstate = states

    const UrlParams = this.$route.params.index
    let url = await this.$axios.get(`user-info/${UrlParams}`)
    const users = url.data
    this.originalData = url.data
    this.userData =  users.students ? users.students : users.teachers
    // console.log(this.userData);

    const lga = await this.$axios.$get('/lga/' + this.userData.stateOrigin)
    this.Nglga = lga

    this.classLevel = await this.$axios.$get('/allclass')
    this.subClass = await this.$axios.$get('/ssclass')

    this.userData.subClass ? this.showSubClass = true : this.showSubClass = false
    
    this.title = 'Editing > ' + this.userData.lastname + ' ' + this.userData.firstname 
    
  },

}
</script>

<style>
  .register {
    margin: auto;
  }
</style>
