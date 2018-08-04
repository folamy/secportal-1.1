<template>
  <v-layout row wrap>
    <panel title="My Students" class="panel">
      <v-flex xs10>
        
      </v-flex>
    </panel>
  </v-layout>
</template>
<script>
export default {
layout: 'teacher',
middleware: 'teacherAuth',
}
</script>
<style scoped>

</style>
