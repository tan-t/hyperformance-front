<template>
  <v-layout row wrap>
  <v-flex xs10 offset-xs1>
    <v-alert v-if="welcome" color="info" icon="info" value="true">
      Welcome! Would You Like To Set Your Profile First ?
    </v-alert>
  </v-flex>
  <v-flex xs10 offset-xs1>
  <v-container>
  <abstract-form ref="form" :fields="fields"></abstract-form>
  <v-btn
   @click="onClickBack"
   v-if="!welcome"
   >
   ←BACK
 </v-btn>
  <v-btn
   @click="onClickUpdate"
   :disabled="!valid"
   v-if="showsButton"
   color="primary"
   >
   {{buttonMessage}}
 </v-btn>
 <v-snackbar
   :timeout="6000"
   :bottom="true"
   v-model="snackbar"
 >
   Update Success.
   <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>
 </v-snackbar>
 </v-container>
</v-flex>
</v-layout>
</template>

<script>
import AbstractForm from '@/components/bt/form/AbstractForm'

const baseUrl = function(url) {
  return `/company/${url}/member/`
}

const getUrl = function (action,opt_id,url) {
  var suffix = action;
  if(!!opt_id) {
    suffix = `${opt_id}/${action}`;
  }
  return baseUrl(url) + suffix;
}

const getMemberData = function(id,url) {
  return new Promise(function(resolve, reject) {
    io.socket.get(getUrl('',id,url),(res,stat)=>{
      if(stat.statusCode != 200) {
        reject('invalid param');
        return;
      }
      resolve(res);
    });
  });
};

export default {
  name: 'CompanyMemberForm',
  components: {
    AbstractForm
  },

  beforeRouteEnter (route, redirect, next) {
    getMemberData(route.params.id,route.params.url).then(res=>{
      next(vm=> {
        vm.id = route.params.id;
        vm.companyUrl = route.params.url;
        vm.setModel(res);
        vm.mode = route.query.mode;
      });
    });
  },

  beforeRouteUpdate (to, from, next) {
    getMemberData(to.params.id,to.params.url).then(res=>{
      this.id = to.params.id;
      this.companyUrl = to.params.url;
      this.mode = to.query.mode;
      this.setModel(res);
      next();
    });
  },
  methods:
  {
    setModel: function(model) {
      Object.keys(model).forEach(key=>{
        let field = this.fields.find(f=>f.id == key);
        if(!field){
          return;
        }
        field.model = model[key];
      });
    },
    createModel: function() {
      var model = this.fields.reduce((a,b)=>{a[b.id] = b.model; return a;},{});
      return model;
    },
    clear: function() {
      this.$refs.form.reset()
    },
    getItem: function(itemId) {
      return this.fields.find(field=>field.id == itemId);
    },
    onClickUpdate: function (e) {
      if (this.$refs.form.validate()) {
        this.fields.forEach(field=>{
          field.errors = [];
        });
        var model = this.createModel();
        model.company_url = this.companyUrl;
        model.id = this.id;
        io.socket.post(getUrl('update',model.id,this.companyUrl),model,(res,stat)=>{
          switch (stat.statusCode) {
            case 200:
              this.snackbar = true;
              if(this.welcome) {
                this.$router.push('/company/' + this.companyUrl + '/dashboard/');
              }
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
      }
    },
    handleServerError: function(error) {
      Object.keys(error.invalidAttributes).forEach(attribute=>{
        console.log(attribute);
        var errors = error.invalidAttributes[attribute].map(e=>e.message);
        this.getItem(attribute).errors = errors;
      });
    },
    onClickBack:function() {
      this.$router.push('/company/' + this.companyUrl + '/member/');
    }
  },
  computed:{
    buttonMessage:function(){
      if(this.mode == 'welcome'){
        return 'UPDATE AND GO TO DASHBOARD';
      }
      return 'UPDATE';
    },
    welcome:function(){
      return this.mode == 'welcome';
    }
  },
  data () {
    return {
      fields: [
        {
          id:'member_name', label:'Member Name', model:'',type: 'TEXT', rules:[
          (v) => !!v || 'Member Name is required'
        ],
          required:true,
          errors:[]
        },
        {
          id:'member_name_sortable', label:'Member Name(Sortable)', model:'',type: 'TEXT', rules:[
          (v) => !!v || 'Member Name(Sortable) is required',
          (v) => {
            const sortable = /^([0-9]|[０-９]|[Ａ-ｚ]|[ｦ-ﾟ]|[ァ-ヶ]|[ぁ-ん]|[A-z])+$/;
            return sortable.test(v) || 'Member Name(Sortable) must be sortable value like hiragana,alphabet.'
          }
        ],
          required:true,
          errors:[]
        },
      ],
      id:0,
      valid: true,
      showsButton:true,
      snackbar:false,
      mode:''
    }
  }
}
</script>
