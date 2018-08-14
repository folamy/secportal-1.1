<template>
	<v-layout row wrap>
    <panel :title="TName || SName" class="panel"> 
      <v-layout column wrap>
        <v-flex class="profile">
					<img
					:src="studentInfo !== null ? '/uploads/students/finals/' + Spassport : '/uploads/teachers/finals/'  + Tpassport"
					height="150"
					width="150">
				</v-flex>
				<v-flex xs10 md6 xl10>
					<h1 class="title mt-4 ml-3 mb-3">Personal Info </h1>
						<v-data-table
							:items="computedStudentInfo || computedTeacherInfo"
							class="elevation-2 ml-5 tableData"
							hide-actions
							hide-headers
						>
							<template slot="items" slot-scope="props">
								<td class="text-xs-left">{{ props.item.name }}:</td>
								<td class="text-xs-left">{{ props.item.personal }}</td>
							</template>
					</v-data-table>
          <v-card width="80%" class="profile">
            <v-card-actions>
              <!-- <v-spacer></v-spacer> -->
              <div class="actionBtns">
                <v-btn 
                  color="error"
                  v-if="admin.superUser"
                  @click.stop="deleteUser"
                >
                  delete
                </v-btn>
                <v-btn 
                  color="accent"
                  @click.stop="edit"
                >
                  edit
                </v-btn>
              </div>
            </v-card-actions>
          </v-card>
				</v-flex>
      </v-layout>
		</panel>
	</v-layout>
</template>

<script>
import { mapState } from "vuex";
export default {
  layout: "admin",
  middleware: "adminAuth",
  data() {
    return {
      studentInfo: null,
      teacherInfo: null,
      adminInfo: null,
      states: null,
      level: null,
    }
  },

  computed: {
    ...mapState([
      "isAdminLoggedIn",
      "admin"
      ]),

    Tpassport() {
      if (this.teacherInfo === null ) return
      return this.teacherInfo.passport;
    },
    Spassport() {
      if (this.studentInfo === null ) return
      return this.studentInfo.passport;
    },

    TName () {
      if (this.teacherInfo !== null) return `Teacher > ${this.teacherInfo.ttitle} ${this.teacherInfo.lastname} ${this.teacherInfo.firstname}` 
      // return `${this.studentInfo.lastname} ${this.studentInfo.firstname}`
    },
    SName () {
      if (this.studentInfo !== null) return `Student > ${this.studentInfo.lastname} ${this.studentInfo.firstname}` 
      // return `${this.studentInfo.lastname} ${this.studentInfo.firstname}`
    },

    computedStudentInfo() {
      if (this.studentInfo === null) return;

      return [
        {
          value: false,
          name: "Names",
          personal:
            this.studentInfo.lastname +
            " " +
            this.studentInfo.firstname +
            " " +
            this.studentInfo.othername
        },
        {
          value: false,
          name: "Student ID",
          personal: this.studentInfo.studId
        },
        {
          value: false,
          name: "Gender",
          personal: this.studentInfo.gender
        },
        {
          value: false,
          name: "Date of Birth",
          personal: this.studentInfo.dob
        },
        {
          value: false,
          name: "State of Origin",
          personal: this.states
        },
        {
          value: false,
          name: "Local Goverment",
          personal: this.studentInfo.localGov
        },
        {
          value: false,
          name: "Class",
          personal: this.level
        },
        {
          value: false,
          name: "SS Class",
          personal: this.studentInfo.subClass
            ? this.studentInfo.subClass
            : "N/A"
        },
        {
          value: false,
          name: "Names ",
          personal: this.studentInfo.guardian
        },
        {
          value: false,
          name: "Home Adress",
          personal: this.studentInfo.homeAddress
        },
        {
          value: false,
          name: "Phone Number",
          personal: this.studentInfo.phoneNumber
        },
        {
          value: false,
          name: "Email Address",
          personal: this.studentInfo.email
        }
      ];
		},
		
    computedTeacherInfo() {
      if (this.teacherInfo === null) return;

      return [
        {
          value: false,
          name: "Names",
          personal:
            this.teacherInfo.lastname +
            " " +
            this.teacherInfo.firstname +
            " " +
            this.teacherInfo.othername
        },
        {
          value: false,
          name: "Teacher ID",
          personal: this.teacherInfo.teacherID
        },
        {
          value: false,
          name: "Gender",
          personal: this.teacherInfo.gender
        },
        {
          value: false,
          name: "Date of Birth",
          personal: this.teacherInfo.dob
        },
        {
          value: false,
          name: "State of Origin",
          personal: this.states
        },
        {
          value: false,
          name: "Local Goverment",
          personal: this.teacherInfo.localGov
        },
        {
          value: false,
          name: "Phone Number",
          personal: this.teacherInfo.phoneNumber
        },
        {
          value: false,
          name: "Home Adress",
          personal: this.teacherInfo.homeAddress
        },
        
        {
          value: false,
          name: "Email Address",
          personal: this.teacherInfo.email
        },
        {
          value: false,
          name: "Next of Kin ",
          personal: this.teacherInfo.nextOfKin
        },
        {
          value: false,
          name: "Next of Kin Home Address",
          personal: this.teacherInfo.nextOfKinHome
        },
        {
          value: false,
          name: "Next of Kin Phone",
          personal: this.teacherInfo.nextOfKinPhone
        },
      ];
    }
  },
  methods: {
    edit () {
      const id = this.studentInfo ? this.studentInfo.studId : this.teacherInfo.teacherID
      this.$router.push(`/admin/edit/${id}`)
    },

    disagree () {
      this.dialog = false
    },

    async deleteUser () {
      try {
        const id = this.studentInfo.studId || this.teacherInfo.teacherID
        swal({
          title: `Delete user?`,
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
              if (res.statusText === 'OK') {
                this.$router.push(`/admin/dashboard`)
              }
            })
          }
        })

      } catch (error) {
        console.log(error);
      }
    } 
  },
  async created() {
    const UrlParams = this.$route.params.index;
    let url = await this.$axios.get(`user-info/${UrlParams}`);
    const users = url.data;

    users.students
      ? (this.studentInfo = users.students)
      : (this.studentInfo = null);
    users.teachers
      ? (this.teacherInfo = users.teachers)
      : (this.teacherInfo = null);
    

    // console.log(this.teacherInfo.passport);

    if (this.teacherInfo || this.studentInfo) {
      let classId = null
      let stateID = this.studentInfo ? this.studentInfo.stateOrigin : this.teacherInfo.stateOrigin;
      if (this.studentInfo) classId = this.studentInfo.classLevel
      const level = await this.$axios.get(`/allclass/${classId}`)
      this.level = level.data.name
      const state = await this.$axios.get(`/state/${stateID}`)
      this.states = state.data.name;
      console.log(this.states);
      
    }

  }
};
</script>

<style scoped>
  .actionBtns{
    margin: 0 auto;
  }
	.profile{
  /* border: 1px solid red; */
  margin: 0 auto !important;
  margin-top: 20px !important;
  margin-bottom: 20px !important;
}
.tableData{
  /* border: 1px solid red; */
  margin: auto !important;
  width: 95% !important;
}
</style>
