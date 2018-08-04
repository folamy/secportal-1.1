<template>
  <v-layout row wrap>
    <panel title='My Subjects' class="panel">
      <v-flex xs10 class="subjects mt-4">
        <v-data-table
          v-model="subs"
          :headers="headers"
          :items="subs"
          class="elevation-1"
          hide-actions
          no-data-text="You have not registered any subject"
        >
        <template slot="items" slot-scope="props">
         <td>{{ props.item.SN }}</td>
         <td>{{ props.item.name }}</td>
         <td class="text-xs-right">{{ props.item.class }}</td>
         <td class="text-xs-right">
           <v-icon class='deleteButtons' title="Delete this subject"  :id="props.item._id" @click="deleteSub($event.target)">delete</v-icon> |
           <v-icon class="studentButtons" title="View students"  :id="props.item._id + '_' + props.item.class" @click="viewStudents($event.target)">people</v-icon>
        </td>

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
      valuess: '',
      subs: [],
      headers: [
        { text: 'S/N', sortable: false, value: '', align: 'left',},
        {
          text: 'Subject Names',
          align: 'left',
          sortable: true,
          value: 'name'
        },
        { text: 'Class', sortable: true, value: 'class' },
        { text: 'Actions', value: 'actions', sortable: false, },
      ],
    }
  },
  methods: {
    async deleteSub (e) {
      swal("Are you sure you want to delete this subject?", {
        buttons: {
          cancel: "Cancel",
          catch: {
            text: "Delete",
            value: "catch",
          },
          // defeat: true,
        },
      })
      .then(async (value) => {
        switch (value) {
          case "catch":

            const delId = e.id
            for (let i = 0; i < this.subs.length; i++) {
              if (this.subs[i]._id === delId) {
                this.subs = this.subs.filter(e => e != this.subs[i])
                const del = await this.$axios.delete(`/deletesubs/${delId}`)
              }
            }

            break;
        }
      });
    },
    viewStudents (e) {
      const id = e.id
      this.$router.push(`students/${id}`)
    }
  },

  async created () {
    console.log('sub1');
    
    const tsubs = await this.$axios.get(`/my-subs/${this.$store.state.teacher.teacherID}`)
    const registered = tsubs.data
    for (var i = 0; i < registered.length; i++) {
      registered[i].text = registered[i].name
      registered[i].SN = i+1
      this.subs.push(registered[i])
    }

  }
}
</script>
<style scoped>
.subjects {
  margin: auto;
}
.deleteButtons {
  color: darkred !important;
  cursor: pointer;
}
.studentButtons {
  color: darkolivegreen !important;
  cursor: pointer;
  margin-left: 5px;
}
</style>
