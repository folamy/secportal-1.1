<template lang="html">
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
          slot="activator"
          label="Date of Birth"
          v-model="date"
          prepend-icon="event"
          readonly
        ></v-text-field>
        <v-date-picker
          header-color="cyan darken-3"
          autosave
          ref="picker"
          v-model="date"
          @change="save"
          min="1950-01-01"
          :max="new Date().toISOString().substr(0, 10)"
        ></v-date-picker>
      </v-menu>
</template>

<script>
export default {
  // new Vue({
  //   el: '#app',
  //   data: () => ({
  //   date: null,
  //   menu: false
  //   }),
  //
  // })
  data () {
    return {
      date: null,
      menu: false
    }
  },

  watch: {
    menu (val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },
  methods: {
    save (date) {
      this.$refs.menu.save(date)
    }
  }
}
</script>

<style lang="css">
</style>
