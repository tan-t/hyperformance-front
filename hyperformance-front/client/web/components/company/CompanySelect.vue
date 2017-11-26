<template>
  <v-layout>
    <v-flex xs12 sm6 offset-sm3>
      <div v-if="companies.length <= 0">
        <h1 class="display-3">
          You have no company here!
        </h1>
        <h3 class="headline">
          You can create your own or join in from the action button placed bottom-right corner.
        </h3>
      </div>
      <v-card v-for="company in companies" :key="company.id">
        <v-card-media :src="company.img" height="200px">
        </v-card-media>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">{{company.name}}</h3>
            <div>{{company.purpose}}</div>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn flat color="orange" @click="onClickDashBoard(company.url)">dashboard</v-btn>
          <v-btn flat color="orange">talk</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>

<!-- <v-tooltip left>
  <v-btn
  fab
  bottom
  right
  color="pink"
  dark
  fixed
  slot="activator"
  @click="onClickFAB"
  >
  <v-icon>add</v-icon>
  </v-btn>
  <span>Create Company</span>
</v-tooltip> -->

<v-speed-dial
v-model="fab"
bottom
right
fixed
large
direction="top"
hover
:transition="'slide-y-reverse-transition'"
>
<v-btn
slot="activator"
color="red"
dark
fab
hover
v-model="fab"
>
<v-icon>add</v-icon>
<v-icon>close</v-icon>
</v-btn>
<v-tooltip left>
<v-btn
fab
dark
color="green"
slot="activator"
@click="onClickJoin"
>
<v-icon>input</v-icon>
</v-btn>
<span>Join Company</span>
</v-tooltip>
<v-tooltip left>
<v-btn
fab
dark
color="indigo"
slot="activator"
@click="onClickCreate"
>
<v-icon>edit</v-icon>
</v-btn>
<span>Create Company</span>
</v-tooltip>
<v-btn
fab
dark
color="red"
>
<v-icon>delete</v-icon>
</v-btn>
</v-speed-dial>
  </v-layout>
</template>



<script>
const getCompanies = function() {
  return new Promise(function(resolve, reject) {
    io.socket.get('/company/',(res,stat)=>{
      if(stat.statusCode==200){
      return resolve(res);
      }
      console.log(stat.statusCode);
    })
  });
}

export default {
  name: 'CompanySelect',

  beforeRouteEnter (route, redirect, next) {
    getCompanies().then(res=>{
      next(vm=>{vm.companies = res});
    });
  },

  beforeRouteUpdate (to, from, next) {
    getCompanies().then(res=>{
      this.companies = res;
      next();
    });
  },

  methods: {
    onClickCreate:function(e) {
      this.$router.push('/company/new');
    },
    onClickJoin:function(e) {
      this.$router.push('/company/join');
    },
    onClickDashBoard:function(url) {
      this.$router.push(`/company/${url}/dashboard`);
    }
  },

  data: ()=> {
    return {
      companies: [],
      fab:false
    };
  }
}
</script>
