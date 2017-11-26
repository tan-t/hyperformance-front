<template>
    <v-app id="hyperformance">
      <v-navigation-drawer
        fixed
        v-model="drawer"
        app
      >
        <v-list dense>
          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Home</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>contact_mail</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Contact</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar color="indigo" dark fixed app>
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title>{{title}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items v-if="user" class="hidden-sm-and-down">
          <v-btn flat>Signed In As : {{user.username}}</v-btn>
          <v-btn flat @click="logout">Logout</v-btn>
        </v-toolbar-items>

        <v-toolbar-items v-if="!user" class="hidden-sm-and-down">
          <v-btn flat @click="login">Sign In</v-btn>
          <v-btn flat @click="signup">Sign Up</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-content>
        <v-container fluid fill-height>
          <router-view>
          </router-view>
        </v-container>
      </v-content>
      <v-footer color="indigo" app>
        <span class="white--text">&copy; 2017</span>
      </v-footer>
    </v-app>
  </template>

<script>
const DEFAULT_TITLE = 'Hyperformance v0.0.1';
export default {
  name: 'app',
  data: () => ({
      drawer: null,
      title: DEFAULT_TITLE,
      user:null
    }),
  watch: {
  '$route': function(value) {
    // lets watch for route changes on our
    // main parent app component.
    var title = value.meta.title || DEFAULT_TITLE;
    this.title = title;

    this.user = this.$router.Auth.user;
  },
},
methods:{
  logout:function(e) {
    this.$router.push('/logout/');
  },
  login:function(e) {
    this.$router.push('/login/');
  },
  signup:function(e) {
    this.$router.push('/user/new');
  }
}
    }
</script>

<style>
#hyperformance {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
