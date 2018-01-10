<template>
  <v-container>

  <v-breadcrumbs>
    <v-icon slot="divider">chevron_right</v-icon>
    <v-breadcrumbs-item
      v-for="ancestor in ancestors" :key="ancestor.id"
    >
      <router-link :to="{ name: 'SectionMst', params: {id:ancestor.id} }">{{ ancestor.name }}</router-link>
    </v-breadcrumbs-item>
  </v-breadcrumbs>
    <abstract-grid @clickaction="onClickEdit" :headers="headers" :items="decendants" :title="title"></abstract-grid>



  <v-card>
      <abstract-grid :headers="memberHeaders" :items="members" :title="'Members'"></abstract-grid>
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
    </v-card>
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
import Postable from '@/mixins/Postable'

const baseUrl = function(projectUrl){
   return `/project/${projectUrl}/section/`;
 }
const getUrl = function (action,opt_id,projectUrl) {
  var suffix = action;
  if(!!opt_id || opt_id === 0) {
    suffix = `${opt_id}/${action}`;
  }
  return baseUrl(projectUrl) + suffix;
}
const getPost = function(projectUrl,nodeId) {
  return new Promise(function(resolve, reject) {
    io.socket.get(getUrl('',nodeId,projectUrl),(res,stat)=>{
      if(stat.statusCode == 200) {
        resolve(res);
      } else {
        reject(res);
      }
    });
  }).then(sectionObj=>{
    return new Promise(function(resolve, reject) {
      io.socket.get(getUrl('member/',nodeId,projectUrl),(res,stat)=>{
        if(stat.statusCode == 200) {
          sectionObj.members = res;
          console.log(res);
          resolve(sectionObj);
        } else {
          reject(res);
        }
      });
    });
  });
}

export default {
  name: 'SectionMst',
  components:{
    AbstractGrid
  },
  mixins:[Postable],
  beforeRouteEnter (route, redirect, next) {
    var projectUrl = route.params.projectUrl;
    var id = route.params.id;
    if(!id) {
      id=0;
    }
    getPost(projectUrl,id).then((res)=>{
      next(vm=>vm.initialize(projectUrl,res.section,res.ancestors,res.decendants,res.members));
    });
  },

  beforeRouteUpdate (to, from, next) {
    var projectUrl = to.params.projectUrl;
    var id = to.params.id;
    if(!id) {
      id=0;
    }
    getPost(projectUrl,id).then((res)=>{
      this.initialize(projectUrl,res.section,res.ancestors,res.decendants,res.members);
      next();
    });
  },
  computed:{
    title:function() {
      return (!this.node.id || this.node.id == 0) ? 'All Sections' : 'Sections';
    }
  },
  methods:
    {
    initialize:function(projectUrl,node,ancestors,decendants,members){
      this.projectUrl = projectUrl;
      this.node = node;
      this.ancestors = ancestors;
      this.decendants = decendants;
      this.members = members;
    },
    createModel:function() {
      var model = {
        name:this.sectionName,
        parent:this.node.id
      }
      return model;
    },
    onClickAdd: function(e) {
      this.dialog = false;
      var model = this.createModel();
      this.post(getUrl('create',null,this.projectUrl),model,(res)=>{
        this.decendants.push(res);
        this.snackbar = true;
      });
    },
    onClickEdit: function(id) {
      this.$router.push(getUrl('',id,this.projectUrl));
    },
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
      memberHeaders:[
        {
          text: 'Member Name',
          align:'center',
          value: 'member_name'
        },
        {
          text: 'Sections',
          align:'center',
          value: 'sections',
          formatters:[(formatInfo,record)=>{
            formatInfo.body = record.sections.reduce((a,b)=>{
              a += '/ ' + b.name;
              return a;
            },'').slice(1);
          }]
        },

      ],
      projectUrl:'',
      decendants:[],
      dialog:false,
      sectionName:'',
      snackbar:false,
      node:{},
      ancestors: [],
      members:[]
    }
  }
}
</script>
