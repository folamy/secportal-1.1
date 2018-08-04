<template>
  <v-layout row wrap>
    <panel title="Register Subjects" class="panel">
      <v-layout row wrap class="mt-4" text-xs-center>
        <v-flex xs4 class="subjects mt-2">
          <div class="notice"><span class="danger-alert">Notice:</span> You will be fully responsible for
            teaching and uploading students' results of any subject you register
          </div>
          <v-select
            class="mt-3"
            v-model="selectedSub"
            :items="subjects"
            :rules="[v => !!v || 'Subject is required']"
            label="Select Subject"
            required
            @input="selected"
            >
          </v-select>
          <v-select
            v-if="selectedSub"
            v-model="selectedClass"
            class="mt-3"
            :items="subClass"
            :rules="[v => !!v || 'Class is required']"
            label="Select Class"
            item-value="name"
            required
            @input="clearErr"
            >
          </v-select>
          <v-btn
              v-if="selectedClass"
              class="white--text"
              color="grey darken-2"
              type="submit"
              @click="addSub">
              Add
            </v-btn>
            <v-btn
              v-if="selectedClass"
              color="red lighten-2"
              class=""
              type="submit"
              @click="clear">
              clear
            </v-btn>
            <div class="danger-alert mt-0 mb-2" v-text="errors" ></div>
        </v-flex>
      </v-layout>
    </panel>
  </v-layout>
</template>
<script>
import swal from 'sweetalert'
import { mapState } from 'vuex'
export default {
  layout: 'teacher',
  middleware: 'teacherAuth',
  data () {
    return {
      errors: '',
      subjects: [],
      selectedSub: '',
      selectedClass: '',
      subs1: [],
      subs2: [],
      allClasses: [],
      subClass: [],
      // regsubs: []
    }
  },
  computed: mapState({
    teacher: 'teacher',
    // studId: 'studId'
  }),
  methods: {
    selected () {
      try {
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
    async addSub () {
      const id = this.teacher.teacherID
      const regsub = {
        teacherID: id,
        name: this.selectedSub,
        class: this.selectedClass
      }

      const tsubs = await this.$axios.get('/teacher-subjects/')
      const registered = tsubs.data

      for (let i = 0; i < registered.length; i++) {
        if (registered[i].name === this.selectedSub && registered[i].class === this.selectedClass) {
          const taker = await this.$axios.get(`/oneteacher/${registered[i].teacherID}`)
          const teacher = taker.data
          if (this.teacher.teacherID === teacher.teacherID) {
            this.errors = `${this.selectedSub} for ${this.selectedClass} has been taken by you :)`
          } else {
            this.errors = `${this.selectedSub} for ${this.selectedClass} has been taken by ${teacher.ttitle} ${teacher.lastname} ${teacher.firstname}`
          }

          swal({
            title: "Error!",
            text: this.errors,
            icon: "error",
            button: 'Okay',
          })

          return
        }
      }
      const response = await this.$axios.post(`/t-addsubs/${id}`, regsub)
      if (response.status === 200) {
          this.success = `${this.selectedSub} for ${this.selectedClass} has been addded to your Subjects list`
          swal({
            title: "Success!",
            text: this.success,
            icon: "success",
            button: "Okay",
          })
          .then((okay) => {
            if (okay) this.selectedSub = null
          })
        }
    },
    clearErr () {
      this.errors ? this.errors = null : null
    },

    clear () {
      this.selectedSub = null
      this.selectedClass = null
    }
  },
  async created() {
    let uniq = arr => [...new Set(arr)]
    const subs = []
    const sub1 = await this.$axios.get('/subject1')
    const sub2 = await this.$axios.get('/subject2')
    const allClass = await this.$axios.get('/allclass')
    console.log(sub1);

    for (let i = 0; i < sub1.data.length; i++) {
      subs.push(sub1.data[i].name)
      this.subs1.push(sub1.data[i].name)
    }

    for (let i = 0; i < sub2.data.length; i++) {
      subs.push(sub2.data[i].name)
      this.subs2.push(sub2.data[i].name)
    }

    for (let i = 0; i < allClass.data.length; i++) {
      allClass.data[i].text = allClass.data[i].name
      this.allClasses.push(allClass.data[i])
    }

    const sub = uniq(subs)
    this.subjects = sub.sort()
  }
}
</script>
<style scoped>
.subjects {
  margin: auto;
}
.notice {
  font-style: italic;
}
</style>
