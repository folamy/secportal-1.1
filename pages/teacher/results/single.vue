
<template>
  <v-layout row wrap>
    <panel title="Single Result Upload" class="panel">
      <v-flex xs12 md6 class="subjects mt-4 ">
        <v-form @submit.prevent="uploadSingle" v-model="valid" ref="form" lazy-validation>
          <v-layout row wrap>
            <v-select
              outline
              clearable
              class="classTerm mt-2"
              v-model="selectedSub"
              :items="subjects"
              :rules="textFieldRule"
              label="Select Subject"
              @input="selected"
              >
            </v-select>
            <v-text-field
              outline
              clearable
              class="classTerm mt-2"
              v-model="studentID"
              :rules="textFieldRule"
              label="Enter Student ID"
              >
            </v-text-field>
          </v-layout>
          <v-layout row wrap >
            <v-radio-group 
              v-model="testExams"
              label="Result Type"
              row
              class="type ml-4"
              :rules="[v => !!v || 'Choose a result type']"
              required
              >
              <v-radio class="ml-2" label="Test" value="test" ></v-radio>
              <v-radio class="" label="Exams" value="exam"></v-radio>
            </v-radio-group>
            <v-radio-group
              v-if="testExams === 'test'"
              v-model="testCA"
              label="CA Test: "
              row
              class="type"
              :rules="[v => !!v || 'Select CA type']"
              required
            >
              <v-radio class="type ml-2 " label="1st CA" value="1st" ></v-radio>
              <v-radio class="type" label="2nd CA" value="2nd"></v-radio>
            </v-radio-group>
          </v-layout>
          <v-layout row wrap>
            <v-select
              outline
              v-model="selectedClass"
              class="classTerm mt-2"
              :items="subClass"
              :rules="textFieldRule"
              label="Select Class"
              item-value="name"
              @input="clearErr"
              >
            </v-select>
            <v-select
              outline
              v-model="selectedTerm"
              class="classTerm mt-2"
              :items="terms"
              :rules="textFieldRule"
              label="Select Term"
              item-value="name"
              @input="clearErr"
              >
            </v-select>
            <v-text-field
              outline
              v-model="score"
              class="classTerm mt-1"
              :rules="textFieldRule"
              label="Enter Score"
              item-value="name"
              @input="clearErr"
              >
            </v-text-field>
          </v-layout>
          <v-layout xs8 class="" align-center>
            <v-btn
              class="btn white--text"
              color="grey darken-2"
              type="submit"
              >
              Upload Result
            </v-btn>
            <v-btn
              class=""
              color="btn red lighten-2"
              @click="clear">
              clear
            </v-btn>
          </v-layout>
          <div class="danger-alert mt-0 mb-2" v-text="errors" ></div>
        </v-form>
      </v-flex>
    </panel>
  </v-layout>
</template>

<script>
import swal from 'sweetalert'
import { mapState } from 'vuex'
export default {
  middleware: 'teacherAuth',
  layout: 'teacher',
  computed: mapState({
    teacher: 'teacher',
    // studId: 'studId'
  }),
  data () {
    return {
      textFieldRule: [v => !!v || 'Field  required'],
      valid: true,
      errors: '',
      score: '',
      testExams: '',
      testCA: '',
      subjects: [],
      selectedSub: '',
      selectedClass: '',
      subs1: [],
      subs2: [],
      allClasses: [],
      subClass: [],
      selectedTerm: '',
      terms: [],
      studentID: '',
      mysubs: ''
    }
  },

  methods: {
    getclass (cls) {
      const classLevel = [
        {name: 'JSS 1', id: 1},
        {name: 'JSS 2', id: 2},
        {name: 'JSS 3', id: 3},
        {name: 'SS 1', id: 4},
        {name: 'SS 2', id: 5},
        {name: 'SS 3', id: 6}
      ]
      let cid = null
      classLevel.forEach(s => {
        if (this.selectedClass === s.name) {
          cid =  s.id
        }
      })
      return cid
    },

    async uploadSingle () {
      try {
        if (this.$refs.form.validate()) {
          const body = {
            ca: this.testCA,
            sclass: this.selectedClass,
            sub: this.selectedSub,
            term: this.selectedTerm,
            studId: this.studentID,
            score: this.score
          }
          const ts = this.mysubs
          let teacherHasRegSub = false
          ts.forEach(subs => {
            if (this.teacher.teacherID === subs.teacherID &&
              this.selectedSub === subs.name &&
              subs.class === this.selectedClass) {
              return teacherHasRegSub = true
            }
          })
          let regsubs = await this.$axios.get('/student-subs')
          const studSub = regsubs.data

          let uploadable = false
          studSub.forEach(rs => {
            const sub = rs.subjects.some((val, i) => {
              if (val.name === this.selectedSub) return true
            })
            if (rs.studId === this.studentID && rs.class === this.getclass() && sub) {
              return uploadable = true
            }
          })

          if (!teacherHasRegSub) {
            swal({
              title: "Error!",
              text: `You have not registered ${body.sub} for ${body.sclass}. You can't upload this result!!`,
              icon: "error",
              button: 'Okay',
            })
            return
          }

          if (!uploadable) {
            swal({
              title: "Error!",
              text: `This student has not registered ${body.sub} for ${body.sclass}`,
              icon: "error",
              button: 'Okay',
            })
            return
          }
          if (isNaN(this.score)) {
            swal({
              title: "Error!",
              text: `Invalid marks/scores, Please enter a valid number`,
              icon: "error",
              button: 'Okay',
            })
            return
          }


          let res = null
          
          if (this.testExams === 'exam') {
            res = await this.$axios.post('/single-result', body)
          } else {
            res = await this.$axios.post('/single-test-result', body)
          }
          
          console.log(res);
          if (res.status === 200) {
            // !this.$refs.form.validate()
            // this.clear()
            swal({
              title: "Uploaded successfully!",
              text: `${body.sub} for ${body.sclass}`,
              icon: "success",
              button: 'Okay',
            })
            return
          }
        }
      } catch (e) {
        console.log(e);
      }
    },

    selected () {
      try {
        // console.log(this.selectedSub);
        this.errors = null
        if (this.subs1.indexOf(this.selectedSub) == -1 && this.subs2.indexOf(this.selectedSub) !== -1) {
          this.subClass = this.allClasses.filter(e => e.classId > 3);
        } else if (this.subs1.indexOf(this.selectedSub) !== -1 && this.subs2.indexOf(this.selectedSub) == -1) {
          this.subClass = this.allClasses.filter(e => e.classId < 4);
        } else if (this.subs1.indexOf(this.selectedSub) !== -1 && this.subs2.indexOf(this.selectedSub) !== -1) {
          this.subClass = this.allClasses
        }
      } catch (error) {
        console.log(error);
      }
    },

    clearErr () {
      this.errors ? this.errors = null : null
    },

    clear () {
      this.selectedSub = null
      this.selectedClass = null
      this.selectedTerm = null
      this.studentID = null
      this.score = null
      this.errors = null
    }
  },
  async created () {
    const getAllTerms = await this.$axios.get('/all-terms')
    getAllTerms.data.forEach(item => {
      this.terms.push(item.term)
    })

    const subs = []
    const mysubs = await this.$axios.get(`/teacher-reg-subs/${this.$store.state.teacher.teacherID}`)
    const allClass = await this.$axios.get('/allclass')
    const sub1 = await this.$axios.get('/subject1')
    const sub2 = await this.$axios.get('/subject2')
    const tsubs = mysubs.data
    this.mysubs = mysubs.data

    for (let i = 0; i < tsubs.length; i++) {
      if (this.selectedSub.indexOf(tsubs[i].name !== -1)) {
        subs.push(tsubs[i].name)
      }
      this.subs1.push(tsubs[i].name)
    }

    for (let i = 0; i < sub1.data.length; i++) {
      this.subs1.push(sub1.data[i].name)
    }

    for (let i = 0; i < sub2.data.length; i++) {
      this.subs2.push(sub2.data[i].name)
    }

    for (let i = 0; i < allClass.data.length; i++) {
      allClass.data[i].text = allClass.data[i].name
      this.allClasses.push(allClass.data[i])
    }

    // const sub = subs.filter(e => e.neme !== e.name)
    this.subjects = subs
  }

}
</script>

<style scoped>
.subjects{
  margin: 0 auto;
}
.classTerm {
  margin: 0 auto;
  max-width: 15.4em
}
.type {
  margin: 0 auto;
  /* max-width: 15.4em */
}

.btn {
  margin: 0 auto;
}
</style>
