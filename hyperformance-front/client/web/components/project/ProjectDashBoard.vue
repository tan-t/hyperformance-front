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
          <v-btn flat color="orange">go</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
const getCompanies = function() {
  return new Promise(function(resolve, reject) {
    var actions = [
      {
      id: 1,
      name: 'Invite Members',
      help: 'てすとてすとてすとてすと',
      img: '/images/invitation.jpeg'
    },
  {
  id: 3,
  name: 'Schedule Practices',
  help: 'てすとてすとてすとてすと',
  img: '/images/dance-practice.jpeg'
  },
  {
  id: 2,
  name: 'Dive Into Project',
  help: 'てすとてすとてすとてすと',
  img: '/images/project.jpg'
  },
  ];
    resolve(actions);
  });
}

export default {
  name: 'ProjectDashBoard',

  beforeRouteEnter(route, redirect, next) {
    getCompanies().then(res => {
      next(vm => {
        vm.actions = res
      });
    });
  },

  beforeRouteUpdate(to, from, next) {
    getCompanies().then(res => {
      this.actions = res;
      next();
    });
  },

  data: () => {
    return {
      actions: [],
      cards: [
        { title: '公演まであと：30日', actions:[{text:'Check Schedule'}],flex: 6, progress:70, color:'warning' },
        { title: '第二通しまであと：10日',actions:[{text:'Check Schedule'}],  flex: 6 ,progress:90, color:'info' },
        { title: '総残席数：12', actions:[{text:'Check Sheets'}], flex: 6 ,progress:95, color:'success' },
        { title: '稽古工数：200h/1460h', actions:[{text:'Check Plans'}], flex: 6 ,progress:80, color:'warning' }
      ]
    };
  }
}
</script>
