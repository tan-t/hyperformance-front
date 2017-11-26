<template lang="html">
  <v-layout row wrap>
    <v-flex xs10 offset-xs1>
      <h1 class="display-4">404 notfound</h1>
      <!-- <v-alert color="error" icon="warning" value="true"> -->
      <h3 class="display-2">
        What you're looking for is unable to find.
      </h3>
      <h5 class="headline">
         It is likely to occur when you try to access a company or project that exists no longer.
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
