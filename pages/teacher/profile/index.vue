<template lang="html">
  <v-layout row wrap>
    <panel title="My Profile" class="panel">
      <v-layout column wrap>
        <v-flex class="profile">
          <img
          :src="'/uploads/teachers/finals/' +  $store.state.Tpassport"
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
export default {
  layout: 'teacher',
  middleware: 'teacherAuth',
  data () {
    return {
      states: '',
      level: '',
      thirdName: '',
      teacher: this.$store.state.teacher
    }
  },
  computed: {
    getOtherNames: function() {
      if (this.teacher.othername) {
        return this.teacher.othername
      } else {
        return ''
      }
    },
    getProfile: function(){
      return [
        {
          value: false,
          name: 'Names',
          personal: this.teacher.ttitle +
            ' ' + this.teacher.lastname +
            ' ' + this.teacher.firstname +
            ' ' + this.getOtherNames
        },
        {
          value: false,
          name: 'Teacher ID',
          personal: this.teacher.teacherID
        },
        {
          value: false,
          name: 'Gender',
          personal: this.teacher.gender,
        },
        {
          value: false,
          name: 'Date of Birth',
          personal: this.teacher.dob,
        },
        {
          value: false,
          name: 'State of Origin',
          personal: this.states
        },
        {
          value: false,
          name: 'Local Goverment',
          personal: this.teacher.localGov,
        },
        {
          value: false,
          name: 'Next of kin',
          personal: this.teacher.nextOfKin,
        },
        {
          value: false,
          name: 'Next of kin Address',
          personal: this.teacher.nextOfKinHome,
        },
        {
          value: false,
          name: 'Next of kin Address',
          personal: this.teacher.nextOfKinPhone,
        }
      ]
    }
  },
  async mounted () {
    const stateID = this.$store.state.teacher.stateOrigin
    const state = await this.$axios.get(`/state/${stateID}`)
    this.states = state.data.name
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
  width: 80% !important;
}

</style>
