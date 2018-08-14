<template>
  <div class="white elevation-2 pa-0 ma-0" >
    <v-toolbar flat dense class="toolbar" dark>
      <v-toolbar-title>{{title}}</v-toolbar-title>
      <slot name="action" />
    </v-toolbar>

    <div class="pl-0 pr-0 pt-0 pb-4">
      <slot>
        No slot content defined.
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'title'
  ]
}
</script>

<style scoped>
</style>
