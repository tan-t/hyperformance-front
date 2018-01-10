<template>
  <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-subheader>Insight</v-subheader>
        <v-container fluid grid-list-md class="grey lighten-4">
          <v-layout row wrap>
            <v-flex
              v-bind="{ [`xs${card.flex}`]: true }"
              v-for="card in cards"
              :key="card.title"
            >
              <v-card>
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0"> <v-icon :color="card.iconColor" :class="card.iconClass">{{card.icon}}</v-icon>  {{card.title}}</h3>
                  </div>
                  <v-progress-linear v-if="card.progress" :value="card.progress" height="10" :color="card.color"></v-progress-linear>
                </v-card-title>
                <v-card-actions class="white">
                  <v-btn v-for="action in card.actions" :key="action.text" flat color="orange">{{action.text}}</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>


      </v-flex>

      <v-flex xs12 sm6 offset-sm3>
        <v-subheader>Action</v-subheader>
      <v-card v-for="action in actions" :key="action.name" transition="slide-x-transition">
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
const getActions = function() {
  return new Promise(function(resolve, reject) {
    var actions = [
      {
      name: 'Team',
      help: 'Nothing starts without members that commit themselves to the project. Here, you can invite new members and manage their profiles.',
      img: '/images/invitation.jpeg',
      action:(vm)=>{
        vm.$router.push(vm.getActionUrl('member'));
      }
    },
    {
    name: 'Sections',
    help: 'Organize your team is always important. Here, you can maintain your project\'s section hierarchy, like \'Interpretation\' , \'Lighting\' or \'Stage Manager\' etc...',
    img: '/images/section.jpeg',
    action:(vm)=>{
      vm.$router.push(vm.getActionUrl('section'));
    }
  },
  {
  name: 'Production Studio',
  help: 'Welcome to the Production Studio! Production is the key team that organizes everything the performance needs to be public. Here, you can PLAN and FIX about the performance, like when to play, when to run-through, or how much to spend...',
  img: '/images/production_studio.jpeg',
  action:(vm)=>{
    vm.$router.push(vm.getActionUrl('production'));
  },
  },
  {
  name: 'Script & Scenes',
  help: 'It is really good to analyze, especially when you are challenging against a difficult project. Here, you can break up your play script into pieces, aka \'scenes\'.',
  img: '/images/script.jpeg',
  action:(vm)=>{
    vm.$router.push(vm.getActionUrl('scene'));
  }
  },
  {
  name: 'Schedule Practices',
  help: 'test',
  img: '/images/dance-practice.jpeg'
  },
  ];
    resolve(actions);
  });
}

export default {
  name: 'ProjectDashBoard',

  beforeRouteEnter(route, redirect, next) {
    var projectUrl = route.params.projectUrl;
    getActions().then(res => {
      next(vm => {
        vm.initialize(projectUrl,res);
      });
    });
  },

  beforeRouteUpdate(to, from, next) {
    var projectUrl = to.params.projectUrl;
    getActions().then(res => {
      this.initialize(projectUrl,res);
      next();
    });
  },

  methods: {
    initialize:function(projectUrl,actions) {
      this.projectUrl = projectUrl;
      this.actions = actions;
    },
    handleAction: function(actionItem) {
      actionItem.action(this);
    },
    getRootUrl: function(){
      return `/project/${this.projectUrl}/`;
    },
    getActionUrl: function(action) {
      return this.getRootUrl() + action;
    }
  },

  data: () => {
    return {
      actions: [],
      cards: [
        { title: '公演まであと：30日', actions:[{text:'Check Schedule'}],flex: 6, progress:70, color:'warning' },
        { title: '第二通しまであと：10日',actions:[{text:'Check Schedule'}],  flex: 6 ,progress:90, color:'info' },
        { title: '総残席数：12', actions:[{text:'Check Sheets'}], flex: 6 ,progress:95, color:'success' },
        { title: '稽古工数：200h/1460h', actions:[{text:'Check Plans'}], flex: 6 ,progress:80, color:'warning' }
      ],
      projectUrl:''
    };
  }
}
</script>

<style>
  h3 {
    text-align: left;
  }
</style>
