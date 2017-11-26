<template>
  <v-container>

  <v-breadcrumbs>
    <v-icon slot="divider">forward</v-icon>
    <v-breadcrumbs-item
      v-for="ancestor in ancestors" :key="ancestor.name"
    >
      {{ ancestor.name }}
    </v-breadcrumbs-item>
  </v-breadcrumbs>

  <v-breadcrumbs>
    <v-icon slot="divider">chevron_right</v-icon>
    <v-breadcrumbs-item
      v-for="ancestor in ancestors" :key="ancestor.name"
    >
      {{ ancestor.name }}
    </v-breadcrumbs-item>
  </v-breadcrumbs>

    <abstract-grid @clickaction="onClickEdit" :headers="headers" :items="sections" :title="'Sections'"></abstract-grid>

      <v-layout row justify-center>
        <v-dialog v-model="dialog" persistent max-width="500px">
          <v-btn color="primary" dark slot="activator">Create A New Section</v-btn>
          <v-card>
            <v-card-title>
              <span class="headline">New Section</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field label="Section Name" required v-model="sectionName" autofocus></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
              <v-btn color="blue darken-1" flat @click="onClickAdd">Add</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>

      <v-snackbar
        :timeout="6000"
        :bottom="true"
        v-model="snackbar"
      >
        Section Created.
        <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>
      </v-snackbar>

 </v-container>
</template>

<script>
import AbstractGrid from '@/components/bt/grid/AbstractGrid'

const baseUrl = '/section/'
const getUrl = function (action,opt_id) {
  var suffix = action;
  if(!!opt_id) {
    suffix = `${opt_id}/${action}`;
  }
  return baseUrl + suffix;
}
const getPost = function(id,cb) {
  // io.socket.get(getUrl('',id),(res)=>{
  //   cb(null,res);
  // })
  cb(null,[]);
}

export default {
  name: 'SectionMst',
  components:{
    AbstractGrid
  },
  beforeRouteEnter (route, redirect, next) {
    getPost(route.params.id, (err, post) => {
      next()
    })
  },

  beforeRouteUpdate (to, from, next) {
    getPost(to.params.id, (err, post) => {
      next()
    })
  },
  methods:
  {
    onClickRegister: function (e) {
      //   io.socket.post(getUrl(this.action,model.id),model,(res,stat)=>{
      //     switch (stat.statusCode) {
      //       case 200:
      //       this.$router.push(getUrl('',res.id));
      //       return;
      //       case 400:
      //       console.log(res);
      //       this.handleServerError(res);
      //       return;
      //       default:
      //       console.log(stat.statusCode);
      //       console.log(res);
      //     }
      //   });
      // }
    },
    handleServerError: function(error) {
      // Object.keys(error.invalidAttributes).forEach(attribute=>{
      //   console.log(attribute);
      //   var errors = error.invalidAttributes[attribute].map(e=>e.message);
      //   this.getItem(attribute).errors = errors;
      // });
    },
    onClickAdd: function(e) {
      this.dialog = false;
      this.sections.push({name:this.sectionName,parent:0}); // TODO
      this.snackbar = true;
    },
    onClickEdit: function(e) {
      console.log(e.target.parentElement.dataset.id);
    }
  },
  data () {
    return {
      headers:[
        {
          text: '',
          align:'center',
          value: 'action',
          type:'ACTION',
          actionId:'id',
          actionName:'Edit',
          sortable:false
        },
        {
          text: 'Section Name',
          align:'center',
          value: 'name'
        },

      ],
      sections:[],
      dialog:false,
      sectionName:'',
      snackbar:false,
      ancestors: []
    }
  }
}
</script>
