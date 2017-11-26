<template lang="html">
  <v-layout row wrap>
    <v-flex xs10 offset-xs1>
      <h1 class="display-4">403 forbidden</h1>
      <!-- <v-alert color="error" icon="warning" value="true"> -->
      <h3 class="display-2">
        Your request is not permitted.
      </h3>
      <h5 class="headline">
         It is likely to occur when you try to access a company or project which is not you participate in.
      </h5>
      <!-- </v-alert> -->
    </v-flex>
    <v-flex xs10 offset-xs1>
      <div>
        <v-btn large href="/">
           GO BACK TO TOP
        </v-btn>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'Forbidden',
}
</script>

<style lang="css">
</style>
