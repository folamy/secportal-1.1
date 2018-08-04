<template lang="html">
  <v-layout row wrap>
    <panel title="Result Batch Upload" class="panel">
      <v-layout row wrap class="subjects">
        <v-flex xs11 md5 class="subjects mt-4 ">
          <v-form @submit.prevent="download" v-model="valid" ref="form" lazy-validation >
            <div class="notice"><span class="danger-alert">Notice:</span>
              We strongly recommend you donwload each subject's csv format
              for a successful upload
            </div>
            <v-select
              outline
              class="Dselectsub mt-3"
              :height="30"
              v-model="selectedSub"
              :items="subjects"
              :rules="textFieldRule"
              label="Select Subject"
              @input="selected"
              >
            </v-select>
            <v-radio-group
              v-model="testExams"
              label="Result Type: "
              row
              class="Rtype"
              :rules="[v => !!v || 'Select result type']"
              required
            >
              <v-radio class="type ml-2 " label="Test" value="test" ></v-radio>
              <v-radio class="type" label="Exams" value="exam"></v-radio>
            </v-radio-group>
            <v-radio-group
              v-if="testExams === 'test'"
              v-model="testCA"
              label="Choose CA Test: "
              row
              class="Rtype"
              :rules="[v => !!v || 'Select result type']"
              required
            >
              <v-radio class="type ml-2 " label="1st CA" value="1st" ></v-radio>
              <v-radio class="type" label="2nd CA" value="2nd"></v-radio>
            </v-radio-group>
            <v-layout row wrap>
              <v-select
                outline
                v-model="selectedClass"
                class="Dselect"
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
                class="Dselect"
                :items="terms"
                :rules="textFieldRule"
                label="Select Term"
                item-value="name"
                @input="clearErr"
                >
              </v-select>
            </v-layout>
            <v-btn
              class="downloadBtn white--text"
              color="grey darken-2"
              type="submit"
              >
              Download Format
            </v-btn>
            <v-btn
              v-if="selectedClass"
              color="downloadBtn red lighten-2"
              class="mt-2"
              @click="clear">
              clear
            </v-btn>
            <div class="danger-alert mt-0 mb-2" v-text="downloadErrors" ></div>
          </v-form>
        </v-flex>
      <!-- </v-layout> -->
      <!-- <v-layout row wrap > -->
        <v-flex xs11 md5 class="subjects mt-4 ">
          <v-flex>
            <div class="notice mb-3">
              <h3>Upload Test Result file here</h3>
            </div>
            <input
              class="inputFile mb-3"
              type="file"
              id="file"
              ref="csvTest"
              @change="handleCsvTest"
              :rules="[v => !!v || 'Class is required']"
            />
            <v-btn
              v-if="!fileErrors"
              class="submitBtn  ml-3 mt-2 white--text mt-2"
              color="grey darken-2"
              type="submit"
              @click="uploadTest"
            >
              Upload
            </v-btn>
            <div class="danger-alert mt-0 mb-2" v-text="testFileErrors"></div>
          </v-flex>

          <v-flex class="mt-5">
            <div class="notice mb-3">
              <h3>Upload Exams Result file here</h3>
            </div>
            <input
              class="inputFile mb-3"
              type="file"
              id="file"
              ref="csvfile"
              @change="handleCsv"
              :rules="[v => !!v || 'Class is required']"
            />
            <v-btn
              v-if="!fileErrors"
              class="submitBtn  ml-3 mt-2 white--text mt-2"
              color="grey darken-2"
              type="submit"
              @click="uploadExams"
            >
              Upload
            </v-btn>
            <div class="danger-alert mt-0 mb-2" v-text="fileErrors"></div>
          </v-flex>
        </v-flex>
      </v-layout>
    </panel>
  </v-layout>
</template>

<script>
import swal from 'sweetalert'
import { mapState } from 'vuex'
import fileDownload from 'js-file-download'
export default {
  layout: 'teacher',
  middleware: 'teacherAuth',
  data () {
    return {
      textFieldRule: [v => !!v || 'Field  required'],
      valid: true,
      image: '',
      testExams: '',
      testCA: '',
      downloadErrors: '',
      testFileErrors: '',
      fileErrors: '',
      subjects: [],
      selectedSub: '',
      selectedClass: '',
      subs1: [],
      subs2: [],
      allClasses: [],
      subClass: [],
      selectedTerm: '',
      terms: [],
      mysubs: ''
    }
  },
  computed: mapState({
    teacher: 'teacher',
    // studId: 'studId'
  }),
  methods: {
    handleCsv (e) {
      this.fileErrors = null
      this.file = this.$refs.csvfile.files[0];
      if ( ! /\/(csv)$/i.test(this.file.type)) {
        this.fileErrors = 'Format not supported: make sure you are uploading ' +
        'a downloaded file format from this page'
        this.file = null
        return;
      }
    },

    handleCsvTest (e) {
      this.testFileErrors = null
      this.testFile = this.$refs.csvTest.files[0];
      if ( ! /\/(csv)$/i.test(this.testFile.type)) {
        this.testFileErrors = 'Format not supported: make sure you are uploading ' +
        'a downloaded file format from this page'
        this.testFile = null
        return;
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
    async uploadExams () {
      try {
        // console.log(this.file);
        if (!this.fileErrors && this.file) {
          let formData = new FormData();
          formData.append('csvfile', this.file);
          let headerOption = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
          }
          const res = await this.$axios.post(`/result-batch-upload/`, formData, headerOption)
          if (res.status === 200) {
            // !this.$refs.form.validate()
            // this.clear()
            swal({
              title: "Uploaded successfully!",
              text: `${res.data}`,
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
    async uploadTest () {
      try {
        // console.log(this.file);
        if (!this.fileErrors && this.testFile) {
          let formData = new FormData();
          formData.append('csvTest', this.testFile);
          let headerOption = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
          }
          const res = await this.$axios.post(`/test-batch-upload/`, formData, headerOption)
          if (res.status === 200) {
            // !this.$refs.form.validate()
            // this.clear()
            swal({
              title: "Uploaded successfully!",
              text: `${res.data}`,
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

    async download () {
      try {
        if (this.$refs.form.validate()) {

          const body = {
            tid: this.teacher.teacherID,
            sclass: this.selectedClass,
            sub: this.selectedSub,
            term: this.selectedTerm,
            type: this.testExams,
            CAType: this.testCA
          }

          const ts = this.mysubs
          let downloadable = false
          for (var i = 0; i < ts.length; i++) {
            if (this.teacher.teacherID === ts[i].teacherID &&
              this.selectedSub === ts[i].name &&
              ts[i].class === this.selectedClass) {
                downloadable = true
            }
          }

          if (downloadable) {
            let res = await this.$axios({
              url: `/downloadResultFormat`,
              method: 'post',
              responseType: 'blob',
              data: body // important
            })

            let disposition = res.headers['content-disposition']
            let filename = decodeURI(disposition.match(/filename="(.*)"/)[1])
            fileDownload(res.data, filename)
          } else {
            swal({
              title: "Error!",
              text: `You have not registered ${body.sub} for ${body.sclass}`,
              icon: "error",
              button: 'Okay',
            })
          }
        }


      } catch (e) {
        console.log(e);
      }
    },

    clearErr () {
      this.errors ? this.errors = null : null
    },

    clear () {
      this.selectedSub = null
      this.selectedClass = null
      this.selectedTerm = null
      this.errors = null
    }
  },

  async created() {
    // const getStudentSubs = await this.$axios.get('/student-subs')
    // this.studentSubs = getStudentSubs.data

    const getAllTerms = await this.$axios.get('/all-terms')
    getAllTerms.data.forEach(item => {
      this.terms.push(item.term)
    })

    const subs = []
    const mysubs = await this.$axios.get(`/my-subs/${this.$store.state.teacher.teacherID}`)
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

<style lang="css" scoped>
.type {
  margin: auto;
}
.Rtype {
  width: 80%;
  margin: auto;
  /* border: 1px solid red; */
}
.downloadBtn {
  margin: auto;
  display: block;
}
.subjects {
  margin: auto;
}
input {
  margin: auto;
  margin-bottom: 20px;
  display: block;
  /* border: 1px solid red */
}
.submitBtn {
  margin: auto !important;
  /* margin-bottom: 20px; */
  display: block;
  /* border: 1px solid red !important */
}
.Dselectsub{
  width: 75%;
  margin: auto;
}
.Dselect {
  max-width: 10em;
  margin: 0 auto;
  /* display: block; */
}
.notice {
  text-align: center;
  font-style: italic;
}
</style>
