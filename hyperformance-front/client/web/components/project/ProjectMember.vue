<template>
  <v-container>

    <abstract-grid @clickaction="onClickEdit" :headers="memberHeaders" :items="members" :title="'Joined Members'"></abstract-grid>



    <v-card>
    <abstract-grid @clickaction="onClickEdit" :headers="invitationHeaders" :items="invitations" :title="'Invitations'"></abstract-grid>
      <v-layout row justify-center>
        <v-dialog v-model="dialog" persistent max-width="500px">
          <v-btn slot="activator">Invite A New Member</v-btn>
          <v-card>
            <v-card-title>
              <span class="headline">Input Email</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field label="Email" required v-model="inviting" autofocus></v-text-field>
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
        <v-btn color="primary"  @click="onClickSendInvitation">Send Invitations</v-btn>
      </v-layout>
    </v-card>

      <v-snackbar
        :timeout="6000"
        :bottom="true"
        v-model="snackbar"
      >
        Invitation Sent.
        <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>
      </v-snackbar>

 </v-container>
</template>

<script>
import AbstractGrid from '@/components/bt/grid/AbstractGrid'

const baseUrl = function(url){
    return `/project/${url}/`;
}

const getUrl = function (action,url) {
  var suffix = action;
  return baseUrl(url) + suffix;
}

const getMembers = function(id) {
  return new Promise(function(resolve, reject) {
    io.socket.get(getUrl('member',id),(res,stat)=>{
      console.log(stat.statusCode);
      console.log(res);
      if(stat.statusCode == 200){
        return resolve(res);
      }
      reject(res);
    });
  });
}

const getInvitations = function(id) {
  return new Promise(function(resolve, reject) {
    io.socket.get(getUrl('invitation',id),(res,stat)=>{
      console.log(stat.statusCode);
      console.log(res);
      if(stat.statusCode == 200){
        return resolve(res);
      }
      reject(res);
    });
  });
}

export default {
  name: 'ProjectMember',
  components:{
    AbstractGrid
  },
  beforeRouteEnter (route, redirect, next) {
    var projectUrl = route.params.projectUrl;
    Promise.all([getMembers(projectUrl),getInvitations(projectUrl)])
    .then(reses=>{
      var members = reses[0];
      var invitations = reses[1];
      next(vm=>vm.initialize(projectUrl,members,invitations));
    }).catch(err=>{
      // ??
    });
  },

  beforeRouteUpdate (to, from, next) {
    var projectUrl = to.params.projectUrl;
    Promise.all([getMembers(projectUrl),getInvitations(projectUrl)])
    .then(reses=>{
      var members = reses[0];
      var invitations = reses[1];
      this.initialize(projectUrl,members,invitations);
      next();
    }).catch(err=>{
      // ??
    });
  },
  methods:
  {
    initialize:function(projectUrl,members,invitations) {
      this.projectUrl = projectUrl;
      this.members = members;
      this.invitations = invitations;
    },
    onClickSendInvitation: function (e) {
        var toObjArray = this.invitations.filter(invitation=>invitation.status == 'LISTING');

        var dueDate = new Date(Date.now());

        var model = {toArray:toObjArray.map(to=>to.to),dueDate};

        console.log(model);

        io.socket.post(getUrl('invite',this.projectUrl),model,(res,stat)=>{
          switch (stat.statusCode) {
            case 200:
            case 201:
            this.snackbar = true;
            toObjArray.forEach(invitation=>{
              invitation.status = 'SENT';
            });
            return;
            case 400:
            console.log(res);
            this.handleServerError(res);
            return;
            default:
            console.log(stat.statusCode);
            console.log(res);
          }
        });
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
      this.invitations.push({to:this.inviting,status:'LISTING'});
      this.inviting = '';
    },
    onClickEdit: function(id) {
      this.$router.push(getUrl('member',this.projectUrl) + `/${id}/edit`);
    },
  },
  data () {
    return {
      memberHeaders:[
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
          text: 'Member Name',
          align:'center',
          value: 'member_name',
        },
        {
          text: 'Member Name(For Sort)',
          align:'center',
          value: 'member_name_sortable',
        },

      ],

      invitationHeaders:[
        // {
        //   text: '',
        //   align:'center',
        //   value: 'action',
        //   type:'ACTION',
        //   actionId:'email',
        //   actionName:'Edit',
        //   sortable:false
        // },
        {
          text: 'Invitation To',
          align:'center',
          value: 'to'
        },
        {
          text: 'Invitation From',
          align:'center',
          value: 'from',
        },
        {
          text: 'Due Date',
          align:'center',
          value: 'dueDate',
        },
        {
          text: 'Status',
          align:'center',
          value: 'status',
          type:'TAG',
          tagMap:{
            'LISTING' : {
              text:'not sent yet',
              color:'warning'
            },
            'JOINED' : {
              text:'joined',
              color:'success'
            },
            'SENT' : {
              text:'sent',
              color:'primary'
            },
            'REJECTED' : {
              text:'rejected',
              color:'red'
            },
            'UNPROCESSED' : {
              text:'unprocessed',
              color:'default'
            },
          }
        },
      ],
      invitations:[],
      members:[],
      dialog:false,
      inviting:'',
      snackbar:false,
      projectUrl:''
    }
  }
}
</script>
