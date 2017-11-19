import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import AbstractList from '@/components/bt/AbstractList'
import UserForm from '@/components/user/UserForm'

Vue.use(Router)

var Auth = {
  loggedIn: false,
  login: function (user) {
    this.loggedIn = true;
    this.user = user;
   },
  logout: function () { this.loggedIn = false }
}

var Login = {
  template:`
  <v-container>
<v-form ref="form" lazy-validation>
  <v-text-field
    label="username or email"
    v-model="identifier"
    :error-messages="errors"
    ></v-text-field>
    <v-text-field
      label="password"
      v-model="password"
      :append-icon="password_visibility ? 'visibility' : 'visibility_off'"
      :append-icon-cb="() => (password_visibility = !password_visibility)"
      type="password"
      :type="!password_visibility ? 'password' : 'text'"
      :error-messages="errors"
    ></v-text-field>
  </v-form>
  <v-btn
   @click="onClickLogin"
   >
   login
 </v-btn>
  </v-container>
  `,
  methods: {
    onClickLogin: function(){
      this.errors = [];
      io.socket.post('/auth/local',{identifier:this.identifier,password:this.password},(res,stat)=>{
        switch (stat.statusCode) {
          case 200:
            Auth.login(res);
            router.push(this.$route.query.redirect)
          return;
          case 403:
            this.errors = ['identifier and password not match.'];
            return;
          default:
          console.log(stat.statusCode);
          console.log(res);
        }
      });
    },
  },
  data:()=>{
    return {
      identifier:'',
      password:'',
      password_visibility:false,
      errors:[],
    };
  }
}

var router = new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: HelloWorld,
      meta: {ignoresAuth: true}
    },
    {
      path: '/list',
      name: 'List',
      component: AbstractList
    },
    {
      path: '/user/new',
      name: 'NewUser',
      component: UserForm,
      meta: {ignoresAuth: true},
      props: { action: 'create' }
    },
    {
      path: '/user/:id',
      name: 'ShowUser',
      component: UserForm,
      meta: {ignoresAuth: true},
      props: { action: 'none' }
    },
    { path: '/login', component: Login, meta: {ignoresAuth: true} },
    { path: '/logout', meta: {ignoresAuth: true} }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(t => t.path === '/logout')) {
    Auth.logout()
    next({path: '/'})
  }

  if (to.matched.some(record => !record.meta.ignoresAuth) && !Auth.loggedIn) {
    next({path: '/login', query: { redirect: to.fullPath }})
  } else {
    next()
  }
})

export default router
