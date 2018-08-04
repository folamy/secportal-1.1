<template>
  <panel title="Subject Registration" class="panel">
    <v-layout column wrap v-if="!student.sch_fees">
      <v-flex class="tableData mt-3">
        <h1 class="title">Select Your Subjects</h1>
        <span>Maximum number of registrable subject is 12</span>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="subs"
          :pagination.sync="pagination"
          select-all
          item-key="name"
          class="table"
        >
        <template slot="headers" slot-scope="props">
          <tr>
            <th>
              <v-checkbox
                :input-value="props.all"
                :indeterminate="props.indeterminate"
                primary
                hide-details
                @click.native="toggleAll"
              ></v-checkbox>
            </th>
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
          <tr :active="props.selected" @click="props.selected = !props.selected">
            <td>
              <v-checkbox
                :input-value="props.selected"
                primary
                hide-details
              ></v-checkbox>
            </td>
            <td>{{ props.item.name }}</td>
            <td class="text-xs-center">{{ props.item.status }}</td>
            <td class="text-xs-center">{{ props.item.school }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>

      <v-flex class="tableData mt-3 mb-4">
          <h1 class="title">Selected Subjects {{selected.length}}</h1>
          <v-data-table
            :headers="headers"
            :items="selected"
            class="elevation-1"
            hide-actions
          >
          <template slot="items" slot-scope="props">
           <td>{{ props.item.name }}</td>
           <td class="text-xs-right">{{ props.item.status }}</td>
           <td class="text-xs-right">{{ props.item.school }}</td>

         </template>
         <template slot="footer" v-if="selected.length">
           <td colspan="100%">
             <v-flex xs class="tableFooter mb-3 mt-3">
               <v-btn @click.native="clearAll" icon class="clear">
                 <v-icon>refresh</v-icon>
               </v-btn>
               <!-- <v-spacer></v-spacer> -->
               <v-btn @click.native="save" class="register">
                 Save
               </v-btn>
             </v-flex>
             <v-flex xs8 class="danger-alert mb-3" v-html="errors"></v-flex>
           </td>
         </template>
       </v-data-table>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-else>
      <v-flex xs8 class="nopayment mt-3">
        <span>School fees payment is required for Subject Registration</span> <br>
        <span><nuxt-link to="/student/payments">Click Here</nuxt-link> to make payments</span>
      </v-flex>
    </v-layout>
  </panel>
</template>

<script>
// import axios from 'axios'
export default {
  middleware: 'studentAuth',
  data () {
    return {
      errors: '',
      serial: 0,
      selected: [],
      subs: [],
      registeredSubs: [],
      pagination: {
        sortBy: 'name'
      },
      headers: [
        {
          text: 'Subject Names',
          align: 'left',
          sortable: true,
          value: 'name'
        },
        { text: 'Status', value: 'status' },
        { text: 'School', value: 'school' },
      ],
      student: this.$store.state.student
    }
  },
  methods: {
    async save () {
      try {
        var newSubs = []
        const registrableCount = 12
        let uniq = arr => [...new Set(arr)]
        // const student = this.$store.state.student
        const sub = this.registeredSubs.concat(this.selected)
        console.log(sub);
        for (var i = 0; i < sub.length; i++) {
          if (sub[i].groupID === 1 || sub[i].groupID === 2 ) {
            for (var s = 0; s < sub.length; s++) {
              if (sub[s].groupID === sub[i].groupID && i !== s) {
                this.errors = 'You can\'t select more than one Language/Religion subject:<br>  '+
                sub[i].name + '/' + sub[s].name+''+'?'+''
                return false
              } else {
                this.errors = ''
              }
            }
          }
          await newSubs.push({
            subID: sub[i].subID,
            name: sub[i].name,
            groupID: sub[i].groupID
          })
        }
        if (newSubs.length > registrableCount) {
          this.errors = 'maximum number of registrable subjects exceeded'
          return false
        }
        // console.log(newSubs);
        const body = {
          studId: this.student.studId,
          class: this.student.classLevel,
          subjects: newSubs
        }
        console.log(newSubs);
        const data = await this.$axios.post(`/regsubs`, body)
        this.$router.push({
          name: 'student-subjects-view'
        })
      } catch (e) {
        if (e) console.log(e);
      }
    },

    toggleAll () {
      if (this.selected.length) this.selected = []
      else this.selected = this.subs.slice()
    },

    changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    },
    clearAll () {
      this.selected = []
    }
  },

  async created () {
    const getRegSubs = await this.$axios.get(`/getregisteredsubs/${this.student.studId}/${this.student.classLevel}`)
    if (getRegSubs.data) {
    const registered = getRegSubs.data.subjects
    this.registeredSubs = registered

    let allsubs = []
    let allsub = allsubs.concat(this.$store.state.subjectReg)
    for (var r = 0; r < registered.length; r++) {
      for (var i = 0; i < allsub.length; i++) {
        if (allsub[i].subID === registered[r].subID) {
          allsub.splice(i, 1)
        }
      }
    }
    this.subs = allsub
  } else {
    this.subs = this.$store.state.subjectReg
  }
},

  async fetch ({store, params, redirect, app: { $axios }}) {
    const student = store.state.student
    const ssClass = student.subClass
    const subs = []
    // console.log(typeof subs);
    if (store.state.student.classLevel < 4) {
      const subj = await $axios.get('/subject1')
      store.commit('setSubject', subj.data)
      // console.log(subj.data);
    } else {
      const subj = await $axios.get('/subject2')
      if (ssClass === 'Art') {
        for (var i = 0; i < subj.data.length; i++) {
          if (subj.data[i].groupID === 0 ||
            subj.data[i].groupID === 1 ||
            subj.data[i].groupID === 2 ||
            subj.data[i].groupID === 3 ) {
            subs.push(subj.data[i]);
          }
        }
      } else if (ssClass === 'Commercial') {
        for (var i = 0; i < subj.data.length; i++) {
          if (subj.data[i].groupID === 0 ||
            subj.data[i].groupID === 1 ||
            subj.data[i].groupID === 2 ||
            subj.data[i].groupID === 4 ) {
            subs.push(subj.data[i]);
          }
        }
      } else if (ssClass === 'Science'){
        for (var i = 0; i < subj.data.length; i++) {
          if (subj.data[i].groupID === 0 ||
            subj.data[i].groupID === 1 ||
            subj.data[i].groupID === 2 ||
            subj.data[i].groupID === 5 ) {
            subs.push(subj.data[i]);
          }
        }
      }
      store.commit('setSubject', subs)
    }

  }
}
</script>

<style scoped>
.nopayment {
  margin: 0 auto !important;
  margin-top: 20px !important;
}
.tableData {
  width: 95%;
  margin: 0 auto;
}
.btn btn--disabled btn--flat btn--icon{
  /* margin-left: 0px !important; */
  background-color: #008b8b !important;
}
.register{
  /* display: table; */
  float: right;
  border: 1px solid #000;
}
.clear {
  margin-left: 10px !important;
}
.danger-alert {
  color: red;
  font-weight: 600;
  /* width: auto; */
  margin: auto
}
</style>
