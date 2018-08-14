<template>
  <v-layout row wrap justify-center >
    <panel title="Users CRUD Operations" class="panel">
      <v-btn
        v-if="switchUser"
        slot="action"
        class="elevation-12 addButton"
        light
        medium
        absolute
        right
        small
        fab
        nuxt
        @click="newuser"
        >
        <v-icon>add</v-icon>
      </v-btn>
      <v-flex xs11 md11 xl10 class="search mt-2 elevation-6 mt-3">
        <v-toolbar
          color="grey lighten-2"
        >
          <v-switch
            v-if="admin.superUser"
            v-model="switchUser"
            class="mr-0"
            color="green lighten-2"
            hide-details
            :label="switchUser ? 'Admin Users' : 'Students and Teachers'"
            @change="usersSwitch"
          ></v-switch>
            <v-autocomplete
            :loading="loading"
            :items="switchUser ? admins: studTeach"
            append-icon=""
            prepend-inner-icon="search"
            :search-input.sync="search"
            v-model="select"
            clearable
            hide-selected
            return-object
            browser-autocomplete="off"
            hide-no-data
            class="search ml-4"
            :label="switchUser ? 'Search admin users' : 'Search students and teachers'"
            flat
            item-text="detail"
            solo
            full-width
            @input="pushSelect"
          ></v-autocomplete>
          <v-btn 
            color="ml-4"
            fab
            small
            @click="refreshDB"
          >
            <v-icon title="refresh">refresh</v-icon>
          </v-btn>
        </v-toolbar>
          
        <v-data-table
          v-if="select"
          no-data-text="search is empty"
          :headers="headers"
          :items="select ? searchResult: []"
          hide-actions
          class="elevation-1 search"
        >
          <template slot="items" slot-scope="props">
            <td>{{ props.item.lastname }}</td>
            <td class="text-xs-center">{{ props.item.firstname }}</td>
            <td class="text-xs-center">{{ props.item.othername ? props.item.othername : ''}}</td>
            <!-- <td class="text-xs-center">{{ props.item.gender }}</td> -->
            <td class="text-xs-center">{{ props.item.classLevel ? props.item.classLevel : 'N/A' }}</td>
            <td class="text-xs-center">{{ props.item.studId || props.item.aid || props.item.teacherID }}</td>
            <td class="text-xs-center">
              <v-tooltip left>
                <v-icon 
                  slot="activator"
                  class='deleteButtons mr-4' 
                  v-if="admin.superUser"
                  @click.stop="deleteUser"
                >
                    delete
                </v-icon>
                <span>delete this user from database</span>
              </v-tooltip>
              <v-tooltip bottom>
                <v-icon 
                  slot="activator"
                  class='studentButtons mr-4' 
                  @click="ViewUser"
                >
                    visibility
                </v-icon>
                <span>view this user</span>
              </v-tooltip>
              <v-tooltip top>
                <v-icon 
                  slot="activator"
                  class='studentButtons mr-4' 
                  @click="editUser"
                >
                    edit
                </v-icon>
                <span>edit user</span>
              </v-tooltip>
              <v-tooltip right>
                <v-icon 
                  slot="activator"
                  class='studentButtons mr-4' 
                  @click="resetPass"
                >
                    settings_backup_restore
                </v-icon>
                <span>reset user's password</span>
              </v-tooltip>
              <v-tooltip bottom>
                <v-icon 
                  slot="activator"
                  class='studentButtons' 
                  @click="editRegSub()"
                >
                    format_list_bulleted
                </v-icon>
                <span>View registered courses</span>
              </v-tooltip>
            </td>
          </template>
        </v-data-table>
      </v-flex>
    </panel>

    <v-layout row wrap  justify-center mt-4>
      <panel :title="admin.superUser ? 'Set Term' : 'Term'" class="panel">
        <v-layout row wrap class="justify-center mt-4" v-if="admin.superUser">
          <v-flex xs8 md3 xl4 class="selectTerm" >
            <v-select
              class=""
              clearable
              v-model="newTerm"
              :items="allterms"
              solo
              item-text="term"
              label="Select Term"
            ></v-select>
          </v-flex>
          
          <v-flex xs8 md4 xl8 class="selectTerm " v-if="admin.superUser">
             <v-menu
            ref="menu"
            lazy
            :close-on-content-click="false"
            v-model="menu"
            transition="scale-transition"
            offset-y
            full-width
            :nudge-right="40"
            min-width="290px"
          >
            <v-text-field
              solo
              v-model="computedDateFormatted"
              slot="activator"
              label="This term ends when?"
              append-icon="event"
              readonly
              required
            ></v-text-field>
            <v-date-picker
              header-color="green darken-3"
              autosave
              ref="picker"
              v-model="date"
              @change="save"
              :min="new Date().toISOString().substr(0, 10)"
              :max="minDate"
            ></v-date-picker>
            </v-menu>
            </v-flex>
            <v-btn 
              dark
              class="mr-4"
              color="grey darken-1"
              @click="setTerm"
            >
              Set Term
            </v-btn>
            <v-flex xs10 class="danger-alert" v-text="errorMsg">           
          </v-flex>
        </v-layout>
        <v-layout row wrap justify-center mt-4>
          <v-flex xs10 md5 xl4 class="selectTerm" >
            <v-text-field
              class="black--text"
              label="Current Term"
              :value="`Current Term: ${this.term} Term`"
              solo-inverted
              disabled
            ></v-text-field>
          </v-flex>
          <v-flex xs10 md5 xl4 class="selectTerm " >
            <v-text-field
              class="black--text"
              :value="formattedTermEnds + ' ' + '(' + countDown + ')'"
              solo-inverted
              disabled
            ></v-text-field>
          </v-flex>
        </v-layout>
      </panel>
    </v-layout>
  </v-layout>
</template>
<script>
import { mapState } from "vuex"
import swal from 'sweetalert'
export default {
  layout: "admin",
  middleware: "adminAuth",
  data() {
    return {
      headers: [
        {
          text: "Surname",
          align: "left",
          sortable: false,
          value: "name"
        },
        {
          text: "First Name",
          value: "",
          sortable: false,
          align: "center"
        },
        {
          text: "Othername",
          value: "",
          sortable: false,
          align: "center"
        },
        //  {
        //    text: 'Gender',
        //    value: '',
        //    sortable: false,
        //    align: 'center',
        //  },
        {
          text: "Class",
          value: "",
          sortable: false,
          align: "center"
        },
        {
          text: "User ID",
          value: "",
          sortable: false,
          align: "center"
        },
        {
          text: "Actions",
          value: "",
          sortable: false,
          align: "center"
        }
      ],

      menu: false,
      switchUser: false,
      loading: false,
      studTeach: [],
      admins: [],
      searchResult: [],
      search: null,
      select: null,
      allUsers: [],
      adminUsers: [],
      users: null,
      date: null,
      newTerm: null,
      dateFormatted: null,
      countDown: null,
      errorMsg: null,
      
    }
  },
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val);
    },
    // countDown (val) {
    //   this.countDown =  setInterval(() => this.countDownFormat(), 1000);
    // },
    
  },
  computed: {
    ...mapState([
      "admin",
      "allterms",
      "term",
      "termEnds"
      ]),
      
      formattedTermEnds () {
        let [day, month, year] = this.termEnds.split('/')
        // return `${day}/${month}/${year}`
        month > 0 ?  month = month - 1 : month = month
        return `Ends on: ${new Date(year, month, day).toDateString()}`
      },

      minDate () {
        let thisDate = new Date()
        return (thisDate.getFullYear() + 1) + "-" + thisDate.getMonth()  + "-" + thisDate.getDay()
      },

      computedDateFormatted () {
        return this.formatDate(this.date)
      },

      
  },

  methods: {
    newuser () {
      this.$router.push({
        name: 'admin-newuser'
      })
    },

    async deleteUser () {
      try {
        const id = this.select.studId || this.select.teacherID || this.select.aid
        swal({
          title: `Delete user: ${this.select.lastname+ ' ' + this.select.firstname}?`,
          text: 'Deleting this user will remove all ' 
                + 'information related to the user from database!' + 
                ' e.g results, registered subject',
          icon: "warning",
          closeOnClickOutside: false,
          buttons: true,
          dangerMode: true
        })
        .then(async mustDelete => {
          if (mustDelete) {
            await this.$axios.get(`delete-users/${id}`)
            .then(res => {
              this.allUsers = []
              this.searchResult = []
              this.select = null
              // this.users = null
              if (res.statusText === 'OK') {
                swal(res.data.success, {
                  closeOnClickOutside: false,
                  icon: "success",
                })
                this.refreshDB()
              }
            })
          }
        })
      } catch (error) {
        console.log(error);
      }
    },

    async ViewUser () {
      const id = this.select.studId ? this.select.studId : this.select.teacherID
      if (!id) return
      this.$router.push(`users/${id}`)
    },

    async editUser () {
      const id = this.select.studId ? this.select.studId : this.select.teacherID
      if (!id) return
      this.$router.push(`edit/${id}`)
    },

    resetPass () {
      try {
        const id = this.select.studId ? this.select.studId.toLowerCase() : this.select.teacherID.toLowerCase()
        let response = null
        const password = {
          newPass: id
        }
        swal({
          title: "Sure to reset Password?",
          text: "This will reset user's password to default password!" + 
                " In most cases, new password will be user's login ID",
          icon: "warning",
          closeOnClickOutside: false,
          buttons: true,
          dangerMode: true,
        })
        .then(async reset => {
          if (reset) {
            if (this.select.studId) {
              response = await this.$axios.post(`/reset-student-password/${id}`, password)
            } else if (this.select.teacherID){
              response = await this.$axios.post(`/reset-teacher-password/${id}`, password)
            }
            if (response.status === 200) {
              swal("Password Reset was successfull!", {
                closeOnClickOutside: false,
                icon: "success",
              });
            }
            
          } else {
            return
          }
        })
       
      } catch (error) {
        console.log(error)
      }
    },

    async editRegSub (e) {
      let clevel = null
      const id = this.select.studId ? this.select.studId : this.select.teacherID
      if (this.select.classLevel) {
        clevel = this.select.classLevel
      }
      this.$router.push({
        name: 'admin-course',
        params: {
          userID: id,
          studClass: clevel
        }
      })
    },

    formatDate (date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },

    save (date) {
      this.$refs.menu.save(date)
    },

    async querySelections(v) {
      
      this.loading = true;
      const { admins, students, teachers } = this.users;
      let users = (users = students.concat(teachers));

      users.forEach(user => {
        const id = user.studId || user.teacherID;
        user.detail = user.lastname + " " + user.firstname + " " + id;
      });

      admins.forEach(user => {
        const id = user.aid;
        user.detail = user.lastname + " " + user.othername + " " + id;
      });
      this.allUsers = users;
      this.adminUsers = admins;
      
      setTimeout(() => {
        if (!this.switchUser) {
          this.studTeach = this.allUsers.filter(e => {
          return (
            (e.detail || "").toLowerCase().indexOf((v || "").toLowerCase()) > -1)
          });
          this.loading = false;
        } else {
          this.admins = this.adminUsers.filter(e => {
          return (
            (e.detail || "").toLowerCase().indexOf((v || "").toLowerCase()) > -1)
          });
          this.loading = false;
        }
      }, 500);

    },

    countDownFormat () {
      let count = null
      let [day, month, year] = this.termEnds.split('/')
      let deadline = new Date(`${month} ${day}, ${year} 00:00:00`).getTime();
      let now = new Date().getTime();
      let t = deadline - now;
      let mt = Math.floor(t / (1000 * 60 * 60 * 24 * 30));
      let days = Math.floor(t / (1000 * 60 * 60 * 24));
      let hours = Math.floor((t%(1000 * 60 * 60 * 24))/(1000 * 60 * 60));
      let minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((t % (1000 * 60)) / 1000)
      t < 0 ? count = "Holiday" : count = mt + "Mth " + days + "D "  + hours + "H " + minutes + "M " + seconds + "S "
      return count
    },

    pushSelect() {
      this.searchResult = [];
      this.searchResult.push(this.select);
    },
    usersSwitch() {
      this.allUsers = [];
      this.searchResult = [];
      this.select = null;
    },
    async refreshDB () {
      try {
        this.allUsers = []
        this.searchResult = []
        this.select = null
        this.users = null
        await this.$axios
        .get("/allusers")
        .then(res => {
          this.users = res.data;
        })
      } catch (err) {
        console.log(err);
        
      }
    },
    async setTerm () {
      try {
        this.errorMsg = null
        let body = {
          term: this.newTerm,
          date: this.computedDateFormatted
        }
        if (!this.newTerm || !this.date) {
          this.errorMsg = "Please select a term and a date "
          return false
        }
        // console.log(body)
        await this.$axios.post('/set-term', body)
        .then(res => {
          console.log(res.data);
          this.newTerm = null
          this.date = null
          this.$store.commit("setTerm", res.data.term);
          this.$store.commit("setTermEnds", res.data.ends);

        })
      } catch (err) {
        console.log(err);
      }
    }
  },
  async created() {
    // Simulated ajax query
    await this.$axios
    .get("/allusers")
    .then(res => {
      this.users = res.data;
    })
    .catch(err => {
      console.log(err);
    });
    
    setInterval(() => {
      this.countDown = this.countDownFormat()
    }, 1000)

  },
};
</script>
<style scoped>
.selectTerm {
  margin: auto;
  /* border: 1px solid red; */
}
.search {
  margin: auto;
  /* border: 1px solid red */
}
.deleteButtons {
  color: darkred !important;
  cursor: pointer;
  display: inline;
}
.studentButtons {
  color: darkolivegreen !important;
  cursor: pointer;
  display: inline;
  /* margin-left: 5px; */
}
</style>
