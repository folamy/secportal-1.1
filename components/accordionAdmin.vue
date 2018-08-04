<template lang="html">
  <v-expansion-panel popout focusable hide-overlay>
    <v-expansion-panel-content 
      v-for="(item,i) in accordionHeads" 
      :key="i" :value="item.index === 2" 
      expand-icon="$vuetify.icons.dropdown" hide-actions
>
      <div class="acchead" slot="header">{{item.title}}</div>
      <v-card>
        <div class="links ml-5 mb-1" v-if="item.title === 'General Information'" v-for="(link,l) in Information" :key="l">
          <nuxt-link class="" :to="{name: link.route}">{{link.title}}</nuxt-link>
        </div>
        <div class="links ml-5 mb-1" v-if="item.title === 'Subjects'" v-for="(link,l) in Subjects" :key="l">
          <nuxt-link class="" :to="{name: link.route}">{{link.title}}</nuxt-link>
        </div>
        <div class="links ml-5 mb-1" v-if="item.title === 'Schedules'" v-for="(link,l) in Schedules" :key="l">
          <nuxt-link class="" :to="{name: link.route}">{{link.title}}</nuxt-link>
        </div>
        <div class="links ml-5 mb-1"  v-if="item.title === 'Results Upload'" v-for="(link,l) in Results" :key="l">
          <nuxt-link class="" :to="{name: link.route}">{{link.title}}</nuxt-link>
        </div>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  layout: 'teacher',
  data () {
    return {
      accordionHeads: [
        {title: 'General Information', index: 1},
        {title: 'Subjects', index: 2},
        {title: 'Schedules', index: 3},
        {title: 'Results Upload', index: 4},
      ],

        Information: [
          {title: 'My Profile', route: 'teacher-profile'},
          {title: 'Change Password', route: 'teacher-profile-change-password'},
          {title: 'Change Passport', route: 'teacher-profile-change-passport'}
        ],

        Subjects: [
          {title: 'Add Subjects', route: 'teacher-subjects'},
          {title: 'My Subjects', route: 'teacher-subjects-subjects'}
        ],

        Schedules: [
          {title: 'My Time-Table', route: ''},
          {title: 'Exams Time-table', route: ''}
        ],

        Results: [
          {title: 'Single Upload', route: 'teacher-results-single'},
          {title: 'Batch Upload', route: 'teacher-results-batch'}
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
