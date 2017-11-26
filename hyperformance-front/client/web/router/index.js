import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import UserForm from '@/components/user/UserForm'
import Home from '@/components/user/Home'
import CompanyForm from '@/components/company/CompanyForm'
import CompanyJoin from '@/components/company/CompanyJoin'
import CompanySelect from '@/components/company/CompanySelect'
import CompanyMember from '@/components/company/CompanyMember'
import CompanyMemberForm from '@/components/company/CompanyMemberForm'
import CompanyDashBoard from '@/components/company/CompanyDashBoard'
import ProjectDashBoard from '@/components/project/ProjectDashBoard'
import ProjectForm from '@/components/project/ProjectForm'
import SectionMst from '@/components/section/SectionMst'
import Forbidden from '@/components/redirect/Forbidden'

Vue.use(Router)

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
 <v-btn
  @click="onClickSignUp"
  primary
  >
  ...or signup
</v-btn>
  </v-container>
  `,
  methods: {
    onClickLogin: function(){
      this.errors = [];
      io.socket.post('/auth/local',{identifier:this.identifier,password:this.password},(res,stat)=>{
        switch (stat.statusCode) {
          case 200:
            var redirect = this.$route.query.redirect;
            if(!redirect){
              redirect = '/home/';
            }
            router.push(redirect);
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
    onClickSignUp:function() {
      var query = {};
      if(this.$route.query.redirect){
        query = {redirect:this.$route.query.redirect};
      }
      this.$router.push({path:'/user/new',query});
    }
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
      path: '/user/new',
      name: 'NewUser',
      component: UserForm,
      meta: {ignoresAuth: true , title: 'User Registration'},
      props: { action: 'create' },

    },
    {
      path: '/user/:id',
      name: 'ShowUser',
      component: UserForm,
      meta: {ignoresAuth: true , title: 'User Info'},
      props: { action: 'none' },

    },
    {
      path: '/company/new',
      name: 'NewCompany',
      component: CompanyForm,
      meta: {title: 'Company Registration'},
      props: { action: 'create' },
    },
    {
      path: '/company/join',
      name: 'JoinCompany',
      component: CompanyJoin,
      meta: {title: 'Join to Company'},
      props: { action: 'join' },
    },
    {
      path: '/company/',
      name: 'SelectCompany',
      component: CompanySelect,
      meta: {title: 'Select Company'}
    },
    {
      path: '/company/:companyUrl/member',
      name: 'CompanyMember',
      component: CompanyMember,
      meta: {title: 'Company Members',concernCompany:true}
    },
    {
      path: '/company/:companyUrl/member/:id/edit',
      name: 'CompanyMemberEdit',
      component: CompanyMemberForm,
      meta: {title: 'Edit Profile',concernCompany:true}
    },
    {
      path: '/company/:companyUrl/dashboard',
      name: 'CompanyDashBoard',
      component: CompanyDashBoard,
      meta: {title: 'DashBoard',concernCompany:true}
    },
    {
      path: '/company/:companyUrl/project/new',
      name: 'NewProject',
      component: ProjectForm,
      meta: {title: 'New Project',concernCompany:true},
      props:{action:'create'}
    },
    {
      path: '/project/:projectId/dashboard',
      name: 'ProjectDashBoard',
      component: ProjectDashBoard,
      meta: {title: 'DashBoard'}
    },
    {
      path: '/project/:projectId/section',
      name: 'SectionMst',
      component: SectionMst,
      meta: {title: 'Sections'}
    },
    {
      path: '/home/',
      name: 'Home',
      component: Home,
      props: (route)=>({user:Auth.user})
    },
    { path: '/login', component: Login, meta: {ignoresAuth: true} },
    { path: '/logout', meta: {ignoresAuth: true} },
    { path: '/forbidden',component:Forbidden,meta:{ ignoresAuth: true}}
  ]
})

var Auth = {};

router.beforeEach((to, from, next) => {
  if (to.matched.some(t => t.path === '/logout')) {
    io.socket.post('/auth/logout',(res,stat)=>{
      delete Auth.user;
      next({path: '/'})
    })
  }

  concernAuth(to,from)
  .then(concernCompany.bind(null,to,from))
  .then(ok.bind(null,next))
  .catch((p)=>{
    next(p);
  });
})

const ok = function(next) {
  return new Promise(function(resolve, reject) {
    next();
    resolve();
  });
}

const concernAuth = function(to,from) {
  return new Promise(function(resolve, reject) {
    if (to.matched.some(record => !record.meta.ignoresAuth)) {
      io.socket.get('/session/getuser',(res,stat)=>{
        if(stat.statusCode == 200){
          console.log(`authenticated user:${res.username}`);
          Auth.user = res;
          resolve();
          return;
        }
        console.log(res);
        console.log(stat.statusCode);
        delete Auth.user;
        reject({path: '/login', query: { redirect: to.fullPath }})
        return;
      });
    } else {
      resolve();
    }
  });
}

const concernCompany = function(to,from) {
  return new Promise(function(resolve, reject) {
    if(to.matched.some(record=>record.meta.concernCompany)){
      var companyUrl = to.params.companyUrl;
      io.socket.get(`/company/${companyUrl}/ismember`,(res,stat)=>{
        console.log(stat.statusCode);
        if(stat.statusCode == 200) {
          resolve();
          return;
        } else {
          reject({path:'/forbidden'});
          return;
        }
      });
    } else {
      resolve();
    }
  });
}

router.Auth = Auth;

export default router
