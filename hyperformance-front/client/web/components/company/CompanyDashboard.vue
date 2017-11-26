<template>
  <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
      <v-card v-for="action in actions" :key="action.id" transition="slide-x-transition">
        <v-card-media :src="action.img" height="200px">
        </v-card-media>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">{{action.name}}</h3>
            <div>{{action.help}}</div>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn flat color="orange" @click="handleAction(action)">go</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>



<script>
const baseUrl = '/company';
const getUrl = function(url,action) {
  return `${baseUrl}/${url}/${action}`;
}

const getActions = function() {
  return new Promise(function(resolve, reject) {
    var actions = [
      {
      id: 1,
      name: 'Invite Members',
      help: 'てすとてすとてすとてすと',
      img: '/images/invitation.jpeg',
      action:(vm) =>{
          vm.$router.push(getUrl(vm.url,'member/'));
      }
    },
    {
    id: 2,
    name: 'Dive Into Project',
    help: 'てすとてすとてすとてすと',
    img: '/images/project.jpg',
    action: (vm) =>{
      vm.$router.push(getUrl(vm.url,'project/new'));
    }
  },
  ];
    resolve(actions);
  });
}

const initializeVm = function(route,cb) {
  return (vm) =>{
    vm.url = route.params.companyUrl;
    cb(vm);
  }
}

export default {
  name: 'CompanyDashBoard',

  beforeRouteEnter(route, redirect, next) {
    getActions().then(res => {
      next(initializeVm(route,vm => {
        vm.actions = res
      }));
    });
  },

  beforeRouteUpdate(to, from, next) {
    getActions().then(res => {
      initializeVm(to,(vm)=>{
        vm.actions = res;
        next();
      })(this);
    });
  },

  methods: {
    handleAction: function(actionItem) {
      actionItem.action(this);
    }
  },

  data: () => {
    return {
      actions: [],
      items: [
         { icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Photos', subtitle: 'Jan 9, 2014' },
         { icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Recipes', subtitle: 'Jan 17, 2014' },
         { icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Work', subtitle: 'Jan 28, 2014' }
       ],
       items2: [
         { icon: 'assignment', iconClass: 'blue white--text', title: 'Vacation itinerary', subtitle: 'Jan 20, 2014' },
         { icon: 'call_to_action', iconClass: 'amber white--text', title: 'Kitchen remodel', subtitle: 'Jan 10, 2014' }
       ],
       url:''
    };
  }
}
</script>
