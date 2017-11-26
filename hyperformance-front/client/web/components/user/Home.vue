

<template>
  <v-container>
  <span>home!</span>
  <span>{{user}}</span>
 </v-container>
</template>

<script>

const baseUrl = '/home/'

const getUrl = function (action) {
  var suffix = action;
  return baseUrl + suffix;
}

const getInfo = function() {
  return new Promise(function(resolve, reject) {
    io.socket.get(getUrl('getinfo'),(res,stat)=>{
      if(stat.statusCode == 200) {
        resolve(res);
        return;
      }
      reject(res);
    });
  });
}

export default {
  name: 'Home',

  beforeRouteEnter (route, redirect, next) {
    getInfo().then(info => {
      next(vm => vm.setData(null, info))
    })
  },

  beforeRouteUpdate (to, from, next) {
    getInfo().then(info => {
      this.setData(null, info)
      next()
    })
  },
  methods:
  {
    setData: function(err,model) {
      if(!err){
        this.setModel(model);
      }
    },
    setModel: function(model) {
      console.log(model);
    },
  },
  data () {
    return {
    }
  },
  props: ['user']
}
</script>
