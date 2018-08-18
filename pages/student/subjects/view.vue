<template lang="html">
  <panel title="Registered Subjects" class="panel">
    <v-flex class="tableData mt-3">
        <!-- <h1 class="title">Selected Subjects</h1> -->
        <v-data-table
          :headers="headers"
          :items="subjects"
          class="elevation-1"
          hide-actions
          :no-data-text="noDataText"
          :loading="isUpdating"
        >
        <v-progress-linear slot="progress" color="secport" indeterminate></v-progress-linear>
        <template slot="items" slot-scope="props">
         <td>{{ props.item.name }}</td>
         <td class="text-xs-center">{{ props.item.status }}</td>
         <td class="text-xs-center">{{ props.item.school }}</td>

       </template>
       <template slot="footer" v-if="subjects.length">
         <td colspan="100%">
           <v-flex xs class="tableFooter">
             <v-btn @click.native="print" class="print">
               Print
             </v-btn>
           </v-flex>
         </td>
       </template>
     </v-data-table>
    </v-flex>
  </panel>
</template>

<script>
export default {
  middleware: 'studentAuth',
  data () {
    return {
      isUpdating: false,
      noDataText: 'loading data',
      subjects: [],
      headers: [
          {
            text: 'Subject Names',
            align: 'left',
            sortable: true,
            value: 'name'
          },
          { text: 'Status', value: 'status', align: 'center', },
          { text: 'School', value: 'school', align: 'center', },
        ],
      student: this.$store.state.student
    }
  },
  methods: {
    async print () {
      //todo
    }
  },

  watch: {
    isUpdating (val) {
      if (val) {
        setTimeout(() => {
          this.isUpdating = !this.isUpdating
          this.noDataText = 'You have not registered any subject'
        }, 2000)
      }
    },
    noDataText () {
    }
  },

  async created () {
    this.isUpdating = true
    const getRegSubs = await this.$axios.get(`/getregisteredsubs/${this.student.studId}/${this.student.classLevel}`)
    let subj

    if (this.$store.state.student.classLevel < 4) subj = await this.$axios.get('/subject1')
    subj = await this.$axios.get('/subject1')
    const subs = subj.data

    if (getRegSubs.data) {
      const registered = getRegSubs.data.subjects
      setTimeout(() => {
        for (var i = 0; i < subs.length; i++) {
          for (var r = 0; r < registered.length; r++) {
            if (subs[i].subID === registered[r].subID) {
              this.subjects.push(subs[i])
            }
          }
        }
      }, 2000)
    }
    
    // console.log(this.subjects);
  }
}
</script>

<style lang="css" scoped>
.tableData {
  width: 95%;
  margin: 0 auto;
}
.print {
  float: right;
  background-color: #808080 !important;
  font-style: normal;
  text-transform: none;
}
</style>
