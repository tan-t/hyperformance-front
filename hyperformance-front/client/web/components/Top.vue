<template>
<v-container fluid fill-height>
  <v-layout>
  <v-flex xs12>
  <v-parallax src="/images/top_1.jpeg" height="1000">
    <v-layout column align-center justify-center>
      <h1 class="display-4 white--text">Hyperformance</h1>
      <h4 class="headline white--text">Make your performance high performance.</h4>

      <v-btn large color="primary">SPPED UP</v-btn>

    </v-layout>
  </v-parallax>

  <v-parallax src="/images/top_3.jpeg" height="1000">
    <v-layout column align-center justify-center>
      <h1 class="display-4 white--text">Practice Management</h1>
      <h2 class="display-3 white--text">Will Help You Concentrate on Creative Works.</h2>
      <h4 class="headline white--text">Are you disgusted with managing when to practice, who is attending and who is not, so therefore we have 2 hours to practice this scene and that scnene...?</h4>
      <v-btn large>LEARN MORE</v-btn>
    </v-layout>
  </v-parallax>

  <v-parallax src="/images/production_studio.jpeg" height="1000">
    <v-layout column align-center justify-center>
      <h1 class="display-4 black--text">Production Studio</h1>
      <h2 class="display-3 black--text">Where Your Work is Organized, Clear, And Visualized.</h2>
      <h4 class="headline black--text">This is like you hire a excellent assistant. What you have to do next is just suggested, as scheduled.</h4>
      <v-btn large>LEARN MORE</v-btn>
    </v-layout>
  </v-parallax>
  </v-flex>
  </v-layout>
</v-container>
</template>

<script>
export default {
  name: 'Top',
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
