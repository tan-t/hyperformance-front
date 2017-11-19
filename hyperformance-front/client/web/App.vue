<template>
  <v-app id="inspire">
    <side-bar :drawer="drawer" @clicked_item="onClickSideBarItem"></side-bar>
    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>{{title}}</v-toolbar-title>
    </v-toolbar>
    <main>
      <v-content>
        <v-container fluid fill-height>
          <router-view></router-view>
        </v-container>
      </v-content>
    </main>
    <v-footer color="indigo" app>
      <span class="white--text">&copy; 2017</span>
    </v-footer>
  </v-app>
</template>


<script>
import SideBar from '@/components/menu/SideBar'

export default {
  name: 'app',
  data: () => ({
    drawer: false,
    title: 'Hyperformance v0.1.0'
  }),
  components: {
    SideBar
  },
  methods: {
    onClickSideBarItem: function (e) {
      console.log(e)
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
