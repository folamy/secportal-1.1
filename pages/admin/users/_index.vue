<template>
	<v-layout row wrap>
    <panel :title="titleName || SName" class="panel"> 
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
      // Tpassport: null,
      // Spassport: null
    };
  },

  computed: {
    ...mapState([
      "isAdminLoggedIn"
      ]),

    Tpassport() {
      if (this.teacherInfo === null ) return
      return this.teacherInfo.passport;
    },
    Spassport() {
      if (this.studentInfo === null ) return
      return this.studentInfo.passport;
    },

    titleName () {
      if (this.teacherInfo !== null) return `${this.teacherInfo.ttitle} ${this.teacherInfo.lastname} ${this.teacherInfo.firstname}` 
      // return `${this.studentInfo.lastname} ${this.studentInfo.firstname}`
    },
    SName () {
      if (this.studentInfo !== null) return `${this.studentInfo.lastname} ${this.studentInfo.firstname}` 
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
          personal: this.studentInfo.classLevel
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
    users.admin 
      ? (this.admin = users.admins) 
      : (this.admin = null);

    // console.log(this.teacherInfo.passport);

    if (this.teacherInfo || this.studentInfo) {
      let stateID = this.studentInfo ? this.studentInfo.stateOrigin : this.teacherInfo.stateOrigin;
      const state = await this.$axios.get(`/state/${stateID}`);
      this.states = state.data.name;
    }
  }
};
</script>

<style scoped>
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
