<template lang="html">
  <v-layout row wrap>
    <panel :title="title" class="panel">
      <v-flex xs9 class="register">
        <h1 class="title mt-2 mb-3">Teacher's Details</h1>
        <v-form  @submit.prevent="saveContinue" v-model="valid" ref="form" lazy-validation>
          <v-select
            outline
            :items="titles"
            v-model="teacherData.ttitle"
            label="Title"
            item-value="text"
            :rules="[v => !!v || 'Title is required']"
            required
          ></v-select>
          <v-text-field
            outline
            label="Surname"
            single-line
            v-model="teacherData.lastname"
            :rules="textFieldRule"
            required
          >
        </v-text-field>
          <v-text-field
            outline
            single-line
            label="First Name"
            v-model="teacherData.firstname"
            value=""
            :rules="textFieldRule"
            required
          ></v-text-field>
          <v-text-field
            outline
            single-line
            label="Other Names"
            v-model="teacherData.othername"
            value=""
          ></v-text-field>

          <v-radio-group
            outline
            v-model="teacherData.gender"
            label="Your gender"
            row
            :rules="[v => !!v || 'Select your gender']"
            required
            >
            <v-radio class="mt-2" label="Male" value="Male" ></v-radio>
            <v-radio class="mt-2" label="Female" value="Female"></v-radio>
          </v-radio-group>

          <!-- <datepicker :dob.sync="teacherData.dob"/> -->
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
              single-line
              slot="activator"
              label="Date of Birth"
              v-model="teacherData.dob"
              append-icon="event"
              readonly
              :rules="textFieldRule"
              required
            ></v-text-field>
            <v-date-picker
              header-color="cyan darken-3"
              autosave
              ref="picker"
              v-model="teacherData.dob"
              @change="save"
              min="1950-01-01"
              :max="new Date().toISOString().substr(0, 10)"
            ></v-date-picker>
          </v-menu>
          <!-- <datepicker :dob.sync="teacherData.dob"/> -->
          <v-select
            outline
            class="mr-4"
            v-model="teacherData.stateOrigin"
            :items="Ngstate"
            :rules="[v => !!v || 'State of origin is required']"
            label="Select State"
            item-value="stateID"
            required
            @input="changeState()"
            >
          </v-select>

          <v-select
            outline
            class="mr-4"
            v-model="teacherData.localGov"
            :items="Nglga"
            :rules="[v => !!v || 'Local Government is required']"
            label="Select Local Government"
            required
            item-value="name"
            >
          </v-select>

          <v-text-field
            outline
            prepend-icon="contact_phone"
            single-line
            label="Personal Phone number"
            v-model="teacherData.phoneNumber"
            value=""
            :rules="phoneReg"
            required
          ></v-text-field>

          <v-textarea
            outline
            prepend-icon="home"
            multi-line
            label="Home Address"
            v-model="teacherData.homeAddress"
            value=""
            :rules="textFieldRule"
            required
          ></v-textarea>
          <v-text-field
            outline
            prepend-icon="contact_mail"
            single-line
            label="Email Address"
            v-model="teacherData.email"
            value=""
            :rules="EmailRules"
            required
          ></v-text-field>

        <h1 class="title mt-2 mb-3">Next of Kin</h1>

          <v-text-field
            outline
            prepend-icon="contacts"
            single-line
            label="Next of Kin's Name"
            v-model="teacherData.nextOfKin"
            value=""
            :rules="textFieldRule"
            required
          ></v-text-field>
          <v-textarea
            outline
            prepend-icon="home"
            multi-line
            label="Home Address"
            v-model="teacherData.nextOfKinHome"
            value=""
            :rules="textFieldRule"
            required
          ></v-textarea>
          <v-text-field
            outline
            prepend-icon="contact_phone"
            single-line
            label="Next of Kin Phone number"
            v-model="teacherData.nextOfKinPhone"
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
          <v-btn
            color="red darken-2"
            @click="clear">
            clear
          </v-btn>
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
import datepicker from '~/components/datepicker'
export default {
  layout: 'teacher',
  components: {
    datepicker
  },
  data () {
    return {
      title: 'Teachers\' Registration Form',
      valid: true,
      teacherData: {
        ttitle: '',
        teacherID: '',
        lastname: '',
        firstname: '',
        othername: '',
        gender:'',
        dob: null,
        stateOrigin: 0,
        localGov: '',
        homeAddress: '',
        phoneNumber: '',
        email: '',
        nextOfKinPhone: '',
        nextOfKin: '',
        nextOfKinHome: ''
      },

      titles: [
        {text: 'Mr.'},
        {text: 'Mrs.'},
        {text: 'Miss.'}
      ],

      idPrefix: 'TID',
      error: null,
      agree: false,
      Ngstate: [],
      Nglga: [],
      stateSelected: '',
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

    async saveContinue (event) {
      try {

        if (this.$refs.form.validate()) {
          this.teacherData.teacherID = this.idPrefix + new Date().getTime().toString().substr(8,5) +
            Math.floor(Math.random()*10)

          // check if student exist in the database
          const response = await this.$axios.post('/t-register' , this.teacherData)

          this.$store.commit('setTeachRegData', this.teacherData)
          this.$router.push({
            name: 'teacher-registration-passport',
          })
        }

      } catch (err) {
        console.log(err);
        this.error = err.response.data.error
      }
    },

    async changeState () {
      const lga = await this.$axios.$get('/lga/' + this.teacherData.stateOrigin)
      this.Nglga = []
      for (var i = 0; i < lga.length; i++) {
        lga[i].text = lga[i].name
        this.Nglga.push(lga[i])
      }
    },

    async SSclass () {
      if (this.teacherData.classLevel > 3) {
        this.showSubClass = true
        this.subClass = []
        const SS = await this.$axios.$get('/ssclass')
        for (var i = 0; i < SS.length; i++) {
          SS[i].text = SS[i].name
          this.subClass.push(SS[i]);
        }
      } else {
        this.showSubClass = false
        this.teacherData.subClass = null
      }
    }

  },

  async created() {
    const obj = {}
    const states =  await this.$axios.$get('/state')
    for (var i = 0; i < states.length; i++) {
      states[i].text = states[i].name
      this.Ngstate.push(states[i]);
    }
    // console.log(this.Ngstate);
    // const allClass = await this.$axios.$get('/allclass')
    // for (var i = 0; i < allClass.length; i++) {
    //   this.classLevel.push(allClass[i])
    // }

    // for (var i = 0; i < this.classLevel.length; i++) {
    //   this.classLevel[i].text = this.classLevel[i].name
    // }
  },

}
</script>

<style scoped>
.register {
  margin: auto !important;
}
.danger-alert {
  color: red;

}

.btn {
  /* border: 1px solid #000 !important; */
  margin-left: 0px !important;
}
.option {
  border: 1px solid red !important;
  /* margin-left: 0px !important; */
}
</style>
