<template >
  <v-expansion-panel inset focusable>
    <v-expansion-panel-content 
      v-for="(item,i) in accordionHeads" 
      :key="i" :value="item.index === 1"
      expand-icon="$vuetify.icons.dropdown">
      <div class="acchead" slot="header">{{item.title}}</div>
      <v-card>
        <div class="links ml-5 mb-1" v-if="item.title === 'General Information'" v-for="(link,l) in Information" :key="l">
          <nuxt-link class="" :to="{name: link.route}">{{link.title}}</nuxt-link>
        </div>
        <div class="links ml-5 mb-1" v-if="item.title === 'Registration'" v-for="(link,l) in Registration" :key="l">
          <nuxt-link class="" :to="{name: link.route}">{{link.title}}</nuxt-link>
        </div>
        <div class="links ml-5 mb-1" v-if="item.title === 'Payment'" v-for="(link,l) in Payment" :key="l">
          <nuxt-link class="" :to="{name: link.route}">{{link.title}}</nuxt-link>
        </div>
        <div class="links ml-5 mb-1" v-if="item.title === 'Result Checker'" v-for="(link,l) in Result" :key="l">
          <nuxt-link class="" :to="{name: link.route}">{{link.title}}</nuxt-link>
        </div>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  data () {
    return {
      accordionHeads: [
        {title: 'General Information', index: 1},
        {title: 'Registration', index: 2},
        {title: 'Payment', index: 3},
        {title: 'Result Checker', index: 4},
      ],

        Information: [
          {title: 'My Profile', route: 'student-profile'},
          {title: 'Change Password', route: 'student-profile-change-password'},
          {title: 'Change Passport', route: 'student-profile-change-passport'}
        ],

        Registration: [
          {title: 'Subject Registration', route: 'student-subjects'},
          {title: 'View Subjects', route: 'student-subjects-view'}
        ],

        Payment: [
          {title: 'School Fees', route: 'student-payments'},
          {title: 'Other Fees', route: 'student-payments-others'}
        ],

        Result: [
          {title: 'Check Results', route: 'student-results'},
        ]

    }
  },
  mounted () {

  }
}
</script>

<style scoped>
.acchead{
  /* border: 1px solid red !important; */
  font-weight: 500;
}
.links a{
  /* border: 1px solid red !important; */
  text-decoration: none !important;
}
</style>
