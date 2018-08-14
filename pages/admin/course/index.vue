<template>
	 <panel title="Subject Registration" class="panel">
    <v-layout column wrap>
      <v-flex class="tableData mt-4">
        <v-data-table
            v-if="subs"
            :headers="headers"
            :items="subs"
            class="elevation-2"
            hide-actions
          >
          <template slot="items" slot-scope="props">
           <td class="text-xs-left">{{ props.item.name }}</td>
           <td class="text-xs-center">{{  props.item.class }}</td>
           <td class="text-xs-center">
              <v-tooltip left>
                <v-icon 
                  slot="activator"
                  class='deleteButtons' 
                  @click.stop="deleteSubs(props.item.name, props.item.class)"
                >
                  delete
                </v-icon>
                <span>delete this subject</span>
              </v-tooltip>
            </td>
         </template>
        </v-data-table>
      </v-flex>
    </v-layout>
	</panel>
</template>

<script>
export default {
  layout: 'admin',
  middleware: 'adminAuth',
	data () {
		return {
      subs: null,
      noDataText: null,
      level: null,
      userID: null,
			headers: [
        {
          text: 'Subject Names',
          align: 'left',
          sortable: true,
          value: 'name'
        },
        { text: 'class', value: 'class', align: 'center'},
        { text: 'Action', value: 'action', align: 'center'}
      ],
		}
  },
  methods: {
    async deleteSubs (sub, tclass) {
      let tsub = this.subs
      let body = {
        userID: this.userID,
        level: this.level
      }

      if (this.level) {
        tsub.forEach(item => {
          if (sub === item.name) {
            this.subs = tsub.filter(e => e.name !== sub)
            body.subjects = this.subs
          } 
        })
      } else {
        for (let i = 0; i < tsub.length; i++) {
          if (tsub[i].name === sub && tsub[i].class === tclass) {
            tsub = tsub.splice(i, 1)
            body.tclass = tclass
            body.tsub = sub
          }
        }
        // this.subs = tsub
      }
        // console.log(body);
      
      await this.$axios.post(`/delete-user-subs`, body)
      .then(res => {
        console.log(res.data);
        this.$store.commit('setAdminSubs', res.data)
      })
    }
  },

  created() {
    this.userID = this.$route.params.userID
    this.level = this.$route.params.studClass
    this.subs = this.$store.state.adminSubs
  },

	async fetch ({store, params, redirect, app: { $axios }}) {
    const userID = params.userID
    const level = params.studClass
    let getRegSubs = null
    if (!store.state.adminSubs || !params.userID) redirect ('/admin/dashboard')
    level 
      ? getRegSubs = await $axios.get(`/get-student-subs/${userID}/${level}`)
      : getRegSubs = await $axios.get(`/get-teacher-subs/${userID}`)
    
    // const getRegSubs = await $axios.get(`/get-student-subs/${userID}/${level}`)
    const subCl = await $axios.get(`/allclass/${level}`)
    const slevel = subCl.data.name
    let subs  = level ? getRegSubs.data.subjects : getRegSubs.data
    subs.forEach(item => {
      item.class = level ? slevel : item.class
    })
    // console.log(subs);
    
    store.commit('setAdminSubs', subs)
	}
}
</script>

<style>
.tableData {
  width: 95%;
  margin: 0 auto;
}
.deleteButtons {
  color: darkred !important;
  cursor: pointer;
  display: inline;
}
</style>
