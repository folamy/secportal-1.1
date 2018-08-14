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
          :loading="isUpdating"
        >
        <v-progress-linear slot="progress" color="secport" indeterminate></v-progress-linear>
        <template slot="items" slot-scope="props">
         <td>{{ props.item.SN }}</td>
         <td>{{ props.item.name }}</td>
         <td class="text-xs-center">{{ props.item.class }}</td>
         <td class="text-xs-center">
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
      isUpdating: false,
      subs: [],
      headers: [
        { text: 'S/N', sortable: false, value: '', align: 'left',},
        {
          text: 'Subject Names',
          align: 'left',
          sortable: true,
          value: 'name'
        },
        { text: 'Class', sortable: true, value: 'class', align: 'center',  },
        { text: 'Actions', value: 'actions', sortable: false, align: 'center', },
      ],
    }
  },
  watch: {
    isUpdating (val) {
      if (val) {
        setTimeout(() => (this.isUpdating = !this.isUpdating), 2000)
      }
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
    this.isUpdating = true
    const tsubs = await this.$axios.get(`/teacher-reg-subs/${this.$store.state.teacher.teacherID}`)
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
