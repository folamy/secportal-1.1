<template>
  <v-layout row wrap>
    <panel :title="`${Sclass} ${subject} Students`" class="panel">
      <v-flex xs10 class="subjects">
        <v-data-table
          :headers="headers"
          :items="students"
          :pagination.sync="pagination"
          select-all
          item-key="name"
          class="table"
          no-data-text="No student for this subject"
          :loading="isUpdating"
        >
        <v-progress-linear slot="progress" color="secport" indeterminate></v-progress-linear>
        <template slot="headers" slot-scope="props">
          <tr>
            <th
              v-for="header in props.headers"
              :key="header.text"
              :class="['text-xs-center column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
              @click="changeSort(header.value)"
            >
              <v-icon small>arrow_upward</v-icon>
              {{ header.text }}
            </th>
          </tr>
        </template>
        <template slot="items" slot-scope="props">
          <tr>
            <td class="text-xs-center">{{ props.item.serial }}</td>
            <td class="text-xs-center">{{ props.item.lastname }}</td>
            <td class="text-xs-center">{{ props.item.firstname }}</td>
            <td class="text-xs-center">{{ props.item.studId }}</td>
            <!-- <td class="text-xs-center">{{ props.item.class }}</td> -->
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </panel>
  </v-layout>
</template>
<script>
export default {
  layout: 'teacher',
  middleware: 'teacherAuth',
  data () {
    return {
      isUpdating: false,
      subject: '',
      Sclass: '',
      students: [],
      selected: [],
      studIds: [],
      pagination: {
        sortBy: 'name'
      },
      headers: [
        {
          text: 'SN',
          sortable: false,
          value: 'serial' },
        {
          text: 'Surname',
          align: 'left',
          sortable: true,
          value: 'lastname'
        },
        { text: 'First Name', value: 'firstname' },
        { text: 'Student ID', value: 'studId' },
        // { text: 'Class', value: 'class' },
      ],
    }
  },
  watch: {
    isUpdating (val) {
      if (val) {
        setTimeout(() => (this.isUpdating = !this.isUpdating), 1000)
      }
    }
  },
  methods: {
    // toggleAll () {
    //   if (this.selected.length) this.selected = []
    //   else this.selected = this.subs.slice()
    // },

    changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    }

  },

  async created () {
    this.isUpdating = true
    const UrlParams = this.$route.params.id
    const idclass = UrlParams.split('_').sort()
    const classLevel = [
      {name: 'JSS 1', id: 1},
      {name: 'JSS 2', id: 2},
      {name: 'JSS 3', id: 3},
      {name: 'SS 1', id: 4},
      {name: 'SS 2', id: 5},
      {name: 'SS 3', id: 6}
    ]
    // console.log(idclass);
    this.Sclass = idclass[1]
    const tsubs = await this.$axios.get(`/teacher-reg-subs/${this.$store.state.teacher.teacherID}`)
    const studentSubs = await this.$axios.get(`/student-subs`)
    const allstudent = await this.$axios.get(`/students`)

    const studsubs = studentSubs.data
    const tsub = tsubs.data
    const students = allstudent.data

    for (let i = 0; i < tsub.length; i++) {
      if (tsub[i]._id === idclass[0]) {
        const teacherSub = tsub[i]
        this.subject = teacherSub.name
        for (let s = 0; s < studsubs.length; s++) {
          const subjects = studsubs[s].subjects
          let studClass = null
          const sc = classLevel.forEach(Sclass => {
            if (Sclass.id === studsubs[s].class) {
              studClass = Sclass.name
            }
          });

          subjects.forEach(subs => {
            if (subs.name === teacherSub.name && studClass === idclass[1]) {
              this.studIds.push(studsubs[s].studId)
            }
          })
        }
      }
    }

    for (let i = 0; i < students.length; i++) {
      const stud = students[i];
      // this.studIds.forEach(id => {
        for (let s = 0; s < this.studIds.length; s++) {
        if (stud.studId === this.studIds[s]) {

          stud.serial = s+1
          stud.text = stud.lastname
          stud.class = idclass[1]
          this.students.push(stud)
        }
      }
    }
  }
}
</script>
<style scoped>
.subjects {
  margin: auto;
  margin-top: 15px;
}
</style>
