<template lang="html">
  <v-chip :color="tagColor" text-color="white">{{tagText}}</v-chip>
</template>

<script>
export default {
  name:'AbstractTag',
  props:['tag','tagMap'],
  computed: {
    tagColor: function () {
      return this.tagMap[this.tag].color;
    },
    tagText: function () {
      return this.tagMap[this.tag].text;
    }
  }
}
</script>

<style lang="css">
</style>
