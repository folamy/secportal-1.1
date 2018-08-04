<template>
  <panel class="panel" title="Result">
    <v-flex xs6>
        <v-subheader class="title">Select Result to display:</v-subheader>
      </v-flex>
    <v-layout row wrap class="tableItems mt-4">
      <v-flex xs8 md4 class="select mt-2">
        <v-select
          outline
          solo
          clearable
          v-model="selectedClass"
          :items="classes"
          label="Class"
          item-value="value"
          @change="clearResult"

        ></v-select>
      </v-flex>
      <v-flex xs8 md4 class="select mt-2">
        <v-select
          outline
          solo
          v-model="selectedResult"
          :items="resultTypes"
          label="Result"
          return-object
          item-value="value"
          @input="showResults"
        ></v-select>
        
      </v-flex>
    </v-layout>
    
    <v-flex xs10>
      <div class="danger-alert mt-2 mb-2" v-text="errors" ></div>
    </v-flex>

    <v-layout row wrap>
      <v-flex xs11 class="tableData mt-3 mb-4" v-if="results">
        <!-- <h1 class="title">Selected Subjects {{selected.length}}</h1> -->
        <v-data-table
          :headers="headers"
          :items="results"
          class="elevation-1"
          hide-actions
        >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.name }}</td>
          <td class="text-xs-center">{{ props.item.firstCa }}</td>
          <td class="text-xs-center">{{ props.item.secondCa }}</td>
          <td class="text-xs-center">{{ props.item.exam }}</td>
          <td class="text-xs-center">{{ props.item.total }}</td>
          <td class="text-xs-center">{{ props.item.grade }}</td>
        </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs11 class="tableData mt-3 mb-4" v-if="testResults">
          <v-data-table
            :headers="testHeaders"
            :items="testResults"
            class="elevation-1"
            hide-actions
          >
          <template slot="items" slot-scope="props">
            <td>{{ props.item.name }}</td>
            <td class="text-xs-center">{{ props.item.firstCa }}</td>
            <td class="text-xs-center">{{ props.item.secondCa }}</td>
            <td class="text-xs-center">{{ props.item.total }}</td>
            <!-- <td class="text-xs-center">{{ props.item.total }}</td>
            <td class="text-xs-center">{{ props.item.grade }}</td> -->
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </panel>
</template>

<script>
import swal from 'sweetalert'
import { mapState } from 'vuex'
export default {
  computed: mapState({
    student: 'student'
  }),

  middleware: 'studentAuth',
  data () {
    return {
      testExams: '',
      select: '',
      results: null,
      testResults: null,
      classes: [],
      selectedClass: null,
      selectedResult: '',
      errors: '',
      // results: '',
      resultTypes: [
        {text: '1st Term CA Test Results', type: 'test', term: '1st'},
        {text: '2nd Term CA Test Results', type: 'test', term: '2nd'},
        {text: '3rd Term CA Test Results', type: 'test', term: '3rd'},
        {text: '1st Term Examination Result', type: 'exam', term: '1st'},
        {text: '2nd Term Examination Result', type: 'exam', term: '2nd'},
        {text: '3rd Term Examination Result', type: 'exam', term: '3rd'}
      ],

      headers: [
        {
          text: 'Subject Names',
          align: 'left',
          sortable: true,
          value: 'name'
        },
        { 
          text: '1st CA',
          value: 'grade',
          sortable: false, 
          align: 'center'
        },
        { 
          text: '2nd CA',
          value: 'grade',
          sortable: false, 
          align: 'center'
        },
        { 
          text: 'Exams',
          value: 'grade',
          sortable: false, 
          align: 'center'
        },
        { 
          text: 'Total',
          value: 'grade',
          sortable: false, 
          align: 'center'
        },
        { 
          text: 'Grade', 
          value: 'grade',
          sortable: true, 
          align: 'center'
        },
      ],
      testHeaders: [
        {
          text: 'Subject Names',
          align: 'left',
          sortable: true,
          value: 'name'
        },
        { 
          text: '1st CA',
          value: 'firstCa',
          sortable: true, 
          align: 'center'
        },
        { 
          text: '2nd CA',
          value: 'secondCa',
          sortable: true, 
          align: 'center'
        },
        { 
          text: 'Total',
          value: 'total',
          sortable: false, 
          align: 'center'
        }
      ],
    }
  },

  methods: {
    async showResults () {
      try {
        const classLevel = [
          {name: 'JSS 1', id: 1},
          {name: 'JSS 2', id: 2},
          {name: 'JSS 3', id: 3},
          {name: 'SS 1', id: 4},
          {name: 'SS 2', id: 5},
          {name: 'SS 3', id: 6}
        ]
        const resultGrade = (scores =>{
          let grade = null
          if (scores >= 70) {
            grade = 'A'
          } else if (scores < 70 && scores >= 60) {
            grade = 'B'
          } else if (scores < 60 && scores >= 50) {
            grade = 'C'
          } else if (scores < 50 && scores >= 45) {
            grade = 'D'
          } else if (scores < 45 && scores >= 40) {
            grade = 'E'
          } else if (scores < 40 && scores >= 0) {
            grade = 'F'
          }
          return grade;
        })

        let rs = this.selectedResult
        this.results = null
        this.testResults = null
        this.errors = null
        
        const body = {
          class: this.selectedClass,
          term: rs.term,
          studId: this.student.studId
        }

        const getTest = await this.$axios.post('/get-test', body)
        const testResult = getTest.data

        let firstCa  = null
        let secondCa  = null
        
        if (testResult.length) {
          testResult.forEach(test => {
            test.ca === '1st' ? firstCa = test.subjects : secondCa = test.subjects
          });
          
          firstCa.forEach(item => {
            item.ca = '1st'
          })
          secondCa.forEach(item => {
            item.ca = '2nd'
          })
        }
        if (this.selectedClass) {
          // test results
          if (rs.type === 'test') {
            let studClass = null
            const sc = classLevel.forEach(Sclass => {
              if (Sclass.name === this.selectedClass) {
                studClass = Sclass.id
              }
            })
            const getRegSubs = await this.$axios.get(`/getregisteredsubs/${this.student.studId}/${this.student.classLevel}`)
            let regsubs = getRegSubs.data.subjects
            // console.log(regsubs);
            // console.log(studClass);

            
            if (testResult.length) {
              regsubs.forEach(sub => {
                firstCa.forEach(test => {
                  if (test.name === sub.name) {
                    sub.firstCa = parseInt(test.score)
                  }
                })

                secondCa.forEach(test => {
                  if (test.name === sub.name) {
                    sub.secondCa = parseInt(test.score)
                  }
                })
                if (isNaN(sub.firstCa) && isNaN(sub.secondCa)) {
                    regsubs = regsubs.filter(e => e != sub)
                  }
                // for (let i = 0; i < regsubs.length; i++) {
                  
                // }
                sub.firstCa ? sub.firstCa = sub.firstCa : sub.firstCa = 0
                sub.secondCa ? sub.secondCa = sub.secondCa : sub.secondCa = 0

                sub.total = sub.firstCa + sub.secondCa 

                sub.firstCa ? sub.firstCa = sub.firstCa : sub.firstCa = 'N/A'
                sub.secondCa ? sub.secondCa = sub.secondCa : sub.secondCa = 'N/A'
              })

              
              this.testResults = regsubs
              
            } else {
              this.errors = `Ops! there no result for the selected class and term `
                swal({
                  title: "Error!",
                  text: this.errors,
                  icon: "error",
                  button: "Okay",
                })
            }
          }
          //exams results
          if (rs.type === 'exam') {
            
              const getResults = await this.$axios.post('/get-results', body)

              if (getResults.data.length) {
                this.results = getResults.data[0].subjects
                this.results.forEach(result => {
                  if (testResult.length) {
                    firstCa.forEach(test => {
                      if (test.name === result.name) {
                        result.firstCa = test.score
                      }
                    })

                    secondCa.forEach(test => {
                      // result.secondCa = 0
                      if (test.name === result.name) {
                        result.secondCa = test.score
                      }
                    })
                  }

                  result.firstCa ? result.firstCa = result.firstCa : result.firstCa = 0
                  result.secondCa ? result.secondCa = result.secondCa : result.secondCa = 0

                  const totalCa = parseInt(result.firstCa) + parseInt(result.secondCa)
                  result.total = totalCa + parseInt(result.score)
                  result.exam = result.score
                  result.grade = resultGrade(result.total)

                  result.firstCa == 0 ? result.firstCa = 'N/A' : result.firstCa = result.firstCa
                  result.secondCa == 0 ? result.secondCa = 'N/A' : result.secondCa = result.secondCa
                });
              } else {
                this.errors = `Ops! there no result for the selected class and term `
                swal({
                  title: "Error!",
                  text: this.errors,
                  icon: "error",
                  button: "Okay",
                })
              }
              // console.log(this.results);
          } 
        } else {
            this.errors = 'Please select a class'
            swal({
              title: "Error!",
              text: 'Please select a class',
              icon: "error",
              button: "Okay",
            })
          }

      } catch (error) {
        console.log(error);
        
      }
    },

  clearResult () {
    this.results = null
    this.selectedResult = null
    this.errors = null
  },

  },

  async created () {
    const allClass = await this.$axios.get('/allclass')
    for (let i = 0; i < allClass.data.length; i++) {
      allClass.data[i].text = allClass.data[i].name
      this.classes.push(allClass.data[i])
    }
    // this.classes = allClass.data
  }

}
</script>

<style scoped>
.tableItems {
  width: 95%;
  margin: 0 auto;
}
.select, title {
  margin: auto;
  flex: auto;
  display: inline;
}
.tableData {
  margin: auto
}
</style>
