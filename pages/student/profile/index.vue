<template lang="html">
  <v-layout row wrap>
    <panel title="My Profile" class="panel">
      <v-layout column wrap>
        <v-flex class="profile">
          <img
          :src="'/uploads/students/finals/' +  $store.state.Spassport"
          :alt="getProfile[0].personal"
          class=""
          height="150"
          width="150">
          <!-- <span class="">passport</span> -->
        </v-flex>
        <v-flex class="center">
          <h1 class="title mt-4 ml-3 mb-3">Personal Info </h1>
            <v-data-table
              :items="getProfile"
              class="elevation-2 ml-4"
              hide-actions
              hide-headers
              :loading="isUpdating"
            >
              <template slot="items" slot-scope="props">
                <td>{{ props.item.name }}:</td>
                <td class="text-xs-left">{{ props.item.personal }}</td>

              </template>
            </v-data-table>

            <h1 class="title mt-4 ml-3 mb-3">Parents' Info</h1>
            <v-data-table
              :items="getParent"
              class="elevation-2 ml-4"
              hide-actions
              hide-headers
            >
            <template slot="items" slot-scope="props">
              <td>{{ props.item.name }}:</td>
              <td class="text-xs-left">{{ props.item.personal }}</td>
            </template>
          </v-data-table>
        </v-flex>

      </v-layout>
    </panel>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import { log } from 'util';
export default {
  data () {
    return {
      isUpdating: false,
      states: '',
      level: '',
      thirdName: '',
      studData: this.$store.state.student
    }
  },
  watch: {
    isUpdating (val) {
      if (val) {
        setTimeout(() => (this.isUpdating = !this.isUpdating), 2000)
      }
    }
  },
  computed: {

    getOtherNames: function() {
      if (this.studData.othername) {
        return this.studData.othername
      } else {
        return ''
      }
    },

    getProfile: function(){
      return [
          {
            value: false,
            name: 'Names',
            personal: this.studData.lastname + ' ' + this.studData.firstname + ' ' + this.getOtherNames
          },
          {
            value: false,
            name: 'Student ID',
            personal: this.studData.studId
          },
          {
            value: false,
            name: 'Gender',
            personal: this.studData.gender,
          },
          {
            value: false,
            name: 'Date of Birth',
            personal: this.studData.dob,
          },
          {
            value: false,
            name: 'State of Origin',
            personal: this.states
          },
          {
            value: false,
            name: 'Local Goverment',
            personal: this.studData.localGov,
          },
          {
            value: false,
            name: 'Class',
            personal: this.level
          },
          {
            value: false,
            name: 'SS Class',
            personal: this.studData.subClass,
          },

        ]
    },

    getParent: function () {
      return [
          {
            value: false,
            name: 'Names ',
            personal: this.$store.state.student.guardian,
          },
          {
            value: false,
            name: 'Home Adress',
            personal: this.$store.state.student.homeAddress,
          },
          {
            value: false,
            name: 'Phone Number',
            personal: this.$store.state.student.phoneNumber,
          },
          {
            value: false,
            name: 'Email Address',
            personal: this.$store.state.student.email,
          },
      ]
    }
  },

  middleware: 'studentAuth',
  async created () {
    this.isUpdating = true
    const stateID = this.$store.state.student.stateOrigin
    const state = await this.$axios.get(`/state/${stateID}`)
    this.states = state.data.name

    const classId = this.$store.state.student.classLevel
    const level = await this.$axios.get(`/allclass/${classId}`)
    this.level = level.data.name
  }

}
</script>

<style scoped>
.profile{
  /* border: 1px solid red; */
  margin: 0 auto !important;
  margin-top: 20px !important;
  margin-bottom: 20px !important;
}
.center{
  /* border: 1px solid red; */
  margin: auto !important;
  width: 95% !important;
}

</style>
