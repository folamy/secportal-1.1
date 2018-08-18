<template>
	<v-layout row wrap>
			<panel title="Admin Single Result Upload" class="panel">
				<v-flex xs12 md7 class="subjects mt-4" >
				<v-form @submit.prevent="uploadSingle" v-model="valid" ref="form" lazy-validation>
					<v-container fluid grid-list-{xs through xl} class=" elevation-4">
						<v-layout wrap align-center justify-center>
							<v-flex xs12 md5 sm6>
								<v-autocomplete
									clearable
									class="classTerm mt-2"
									v-model="selectedSub"
									:items="subjects"
									:rules="textFieldRule"
									label="Select Subject"
									no-data-text="Subject not found"
									item-text="name"
									@input="selected"
									>
								</v-autocomplete>
							</v-flex>
							<v-flex xs12 md5 sm6>
								<v-text-field
									clearable
									class="classTerm mt-2"
									v-model="studentID"
									:rules="textFieldRule"
									label="Enter Student ID"
									>
								</v-text-field>
							</v-flex>
						</v-layout>
						<v-layout wrap align-center justify-center>
							<v-flex xs12 md8 sm8 >
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
							</v-flex>
						</v-layout>
						<v-layout row wrap align-center justify-center>
            	<v-flex xs12 md4 sm6>
								<v-autocomplete
								v-model="selectedClass"
								class="classTerm mt-2"
								:items="subClass"
								:rules="textFieldRule"
								label="Select Class"
								item-value="name"
								item-text="name"
								@input="clearErr"
								>
								</v-autocomplete>
							</v-flex>
							<v-flex xs12 md4 sm6>
								<v-select
								v-model="selectedTerm"
								class="classTerm mt-2"
								:items="terms"
								:rules="textFieldRule"
								label="Select Term"
								item-text="term"
								item-value="term"
								>
								</v-select>
							</v-flex>
							<v-flex xs12 md4 sm6>
								<v-text-field
								v-model="score"
								class="classTerm mt-1"
								:rules="textFieldRule"
								label="Enter Score"
								item-text="term"
								item-value="term"
								@input="clearErr"
								>
								</v-text-field>
						</v-flex>
          </v-layout>
					<v-card-text class="ss" style="text-align: center">
						<v-btn
						 	color="secport"
							type="submit"
						>
							Submit
						</v-btn>
					</v-card-text>
				</v-container>
			</v-form>
		</v-flex>
		</panel>
	</v-layout>
	</template>

<script>
export default {
	layout: "admin",
  middleware: "adminAuth",
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
          // const ts = this.mysubs
          // let teacherHasRegSub = false
          // ts.forEach(subs => {
          //   if (this.teacher.teacherID === subs.teacherID &&
          //     this.selectedSub === subs.name &&
          //     subs.class === this.selectedClass) {
          //     return teacherHasRegSub = true
          //   }
          // })
          let regsubs = await this.$axios.get('/a-student-subs')
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

          // if (!teacherHasRegSub) {
          //   swal({
          //     title: "Error!",
          //     text: `You have not registered ${body.sub} for ${body.sclass}. You can't upload this result!!`,
          //     icon: "error",
          //     button: 'Okay',
          //   })
          //   return
          // }

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
            res = await this.$axios.post('/a-single-result', body)
          } else {
            res = await this.$axios.post('/a-single-test-result', body)
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
    this.terms = getAllTerms.data
      

    const subs = []
		const allClass = await this.$axios.get('/allclass')

		this.subClass = allClass.data

    const sub1 = await this.$axios.get('/subject1')
		const sub2 = await this.$axios.get('/subject2')
		let subjs = sub1.data
		let subss = sub2.data

		// subs = this.subjects
		for (let i = 0; i < subjs.length; i++) {
			for (let s = 0; s < subss.length; s++) {
				if (subjs[i].name === subss[s].name) {
					subjs.splice(i, 1)	
				}
			}
		}
		this.subjects = subjs.concat(subss)
		console.log(this.subjects);
		

  }
}
</script>

<style>
.subjects, submitBtn {
	margin: auto;
}
</style>
