<template>
	<v-layout row wrap>
		<panel title="All Subjects" class="panel">
      <v-flex xs11 md11 xl10 class="search mt-4 elevation-6 mt-3">
        <v-toolbar
          color="grey lighten-2"
        >
          <v-switch
            v-model="switchSchool"
            class="mr-0"
            color="green lighten-2"
            hide-details
            :label="switchSchool ? 'SS Subjects' : 'JS Subjects' "
            @change="subSwitch"
          ></v-switch>
          <v-autocomplete
            :loading="loading"
            :items="switchSchool ? jsubject : ssubject"
            append-icon=""
            prepend-inner-icon="search"
            :search-input.sync="search"
            v-model="select"
            clearable
            return-object
            browser-autocomplete="off"
            hide-no-data
            hide-details
            class="search ml-4"
            :label="switchSchool ? 'Search SS Subjects' : 'Search JS Subjects'"
            flat
            item-text="detail"
            solo
            full-width
            @input="pushSelect"
          ></v-autocomplete>
        </v-toolbar>
      </v-flex>
      
			<v-flex xs11 md11 xl10 class="search mt-2 elevation-6 mt-3">
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="select ? searchResult : viewSubs"
          :pagination.sync="pagination"
          select-all
          item-key="name"
          class="table"
        >
        <template slot="headers" slot-scope="props">
          <tr>
            <th
              v-for="header in props.headers"
              :key="header.text"
              :class="
                (header.text !== 'Subject Names' && header.text !== 'Action') ? 
                ['text-xs-center column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']
                 : ['text-xs-left column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
              @click="changeSort(header.value)"
            >
              <v-icon small>arrow_upward</v-icon>
              {{ header.text }}
            </th>
            <th v-if="select" class="text-xs-center">
              Action
            </th>
          </tr>
        </template>
        <template slot="items" slot-scope="props">
          <tr :active="props.selected" @click="props.selected = !props.selected">
            <td>{{ props.item.name }}</td>
            <td class="text-xs-center">{{ props.item.status }}</td>
            <td class="text-xs-center">{{ props.item.school }}</td>
            <td class="text-xs-center" v-if="select">
							<v-tooltip bottom>
                <v-icon 
                  slot="activator"
                  class='deleteButtons' 
                  v-if="admin.superUser"
                  @click="deleteSub(props.item._id)"
                >
									delete
                </v-icon>
                <span>delete subject</span>
              </v-tooltip>
            </td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
		</panel> 
	</v-layout>
</template>

<script>
import { mapState } from "vuex";
import swal from "sweetalert";
export default {
  layout: "admin",
  middleware: "adminAuth",
  data() {
    return {
      ssubject: [],
      jsubject: [],
      switchSchool: false,
      loading: false,
      searchResult: [],
      search: null,
      select: null,
      allSubs: null,
      errors: "",
      serial: 0,
      selected: [],
      viewSubs: [],
      pagination: {
        sortBy: "name"
      },
      headers: [
        // { text: 'Action', value: 'action', sortable: !true},
        {
          text: "Subject Names",
          align: "left",
          sortable: true,
          value: "name"
        },
        { text: "Status", value: "status" },
        { text: "School", value: "school" }
      ]
    };
  },
  computed: {
    ...mapState(["admin"])
  },

  watch: {
    async search(v) {
      // if (!this.select) this.allSubs = null
      if (this.allSubs) return
      const js = await this.$axios.get("/subject2");
      const ss = await this.$axios.get("/subject1");
      this.allSubs = {
        jsubs: js.data,
        ssubs:  ss.data
      }

      this.loading = true;

      const { jsubs, ssubs } = this.allSubs;

      jsubs.forEach(sub => {
        const school = sub.school;
        sub.detail = sub.name + " " + school;
      });

      ssubs.forEach(sub => {
        const school = sub.school;
        sub.detail = sub.name + " " + school;
      });

      this.ssubject = ssubs
      this.jsubject = jsubs

      setTimeout(() => {
        if (!this.switchSchool) {
          this.ssubject = this.ssubject.filter(e => {
            return (
              (e.detail || "").toLowerCase().indexOf((v || "").toLowerCase()) > -1);
          });
          this.loading = false;
        } else {
          this.jsubject = this.jsubject.filter(e => {
            return (
              (e.detail || "").toLowerCase().indexOf((v || "").toLowerCase()) > -1);
          });
          this.loading = false;
        }
      }, 1000);
    }
  },

  methods: {
    toggleAll() {
      if (this.selected.length) this.selected = [];
      else this.selected = this.subs.slice();
    },

    subSwitch() {
      this.allSubs = null;
      this.searchResult = [];
      this.select = null;
    },

    async deleteSub(id) {
      // let allsubs = this.viewSubs;
      swal({
        title: "Sure to delete this Subject?",
        text: "This will remove this subject from database",
        icon: "warning",
        closeOnClickOutside: false,
        buttons: true,
        dangerMode: true
      }).then(async subDelete => {
        if (subDelete) {
          await this.$axios.post(`/delete-subject/${id}`).then(res => {
            if (res.data.success) {
              // this.ssubject = []
              // this.jsubject = []
              this.searchResult = []
              this.select = null
              this.viewSubs = res.data.subs.js.concat(res.data.subs.ss) 
              this.allSubs = null
            }
          })
        } else {
          return;
        }
      });
    },

    pushSelect() {
      // this.allSubs = null
      this.searchResult = [];
      this.searchResult.push(this.select);
    },

    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    }
  },

  async created() {
    let sub = null;
    const jsubs = await this.$axios.get("/subject2");
    const ssubs = await this.$axios.get("/subject1");
    this.viewSubs = jsubs.data.concat(ssubs.data);

    // this.allSubs = {
    //   jsubs: jsubs.data,
    //   ssubs: ssubs.data
    // };
  }
};
</script>

<style>
.tableData {
  width: 95%;
  margin: 0 auto;
}
.search {
  margin: auto;
  /* border: 1px solid red */
}
.deleteButtons {
  cursor: pointer;
}
</style>
