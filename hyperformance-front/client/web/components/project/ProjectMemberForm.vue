<template>
  <v-layout row wrap>
  <v-flex xs10 offset-xs1>
    <v-alert v-if="welcome" color="info" icon="info" value="true">
      Welcome! Would You Like To Set Your Profile First ?
    </v-alert>
  </v-flex>
  <v-flex xs10 offset-xs1>
  <v-container>
  <abstract-form ref="form" :fields="fields">
  </abstract-form>
  <v-card>
  <v-container>
  <v-select
  label="sections"
  autocomplete
  :loading="loading"
  multiple
  cache-items
  chips
  required
  :items="sectionItems"
  :rules="[() => sections.length > 0 || 'You must choose at least one']"
  :search-input.sync="sectionSearch"
  v-model="sections"
  item-text="label"
  item-value="value"
  ></v-select>
  </v-container>
  </v-card>
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
import SearchSelect from '@/components/bt/form/SearchSelect'

const baseUrl = function(url) {
  return `/project/${url}/member/`
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
  name: 'ProjectMemberForm',
  components: {
    AbstractForm,SearchSelect
  },

  beforeRouteEnter (route, redirect, next) {
    var id = route.params.id
    var projectUrl = route.params.projectUrl;
    var mode = route.query.mode;
    getMemberData(id,projectUrl).then(res=>{
      next(vm=> {
        vm.initialize(projectUrl,id,res,mode);
      });
    });
  },
  beforeRouteUpdate (to, from, next) {
    var id = to.params.id;
    var projectUrl = to.params.projectUrl;
    var mode = to.query.mode;
    getMemberData(id,projectUrl).then(res=>{
      this.initialize(projectUrl,id,res,mode);
      next();
    });
  },
  methods:
  {
    initialize:function(projectUrl,id,model,mode) {
      this.id = id;
      this.projectUrl = projectUrl;
      this.mode = mode;
      this.setModel(model);
    },
    setModel: function(model) {
      Object.keys(model).forEach(key=>{
        let field = this.fields.find(f=>f.id == key);
        if(!field){
          return;
        }
        field.model = model[key];
      });
      if(model.sections) {
        this.sections = model.sections.map(section=>{
          return {errors:[],value:section.value};
        });
        this.sectionItems = model.sections.map(section=>{
          return {label:section.value.label,value:section.value};
        });
      }
    },
    createModel: function() {
      var model = this.fields.reduce((a,b)=>{a[b.id] = b.model; return a;},{});
      model.sections = this.sections;
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
        model.project_url = this.projectUrl;
        model.id = this.id;
        io.socket.post(getUrl('update',model.id,this.projectUrl),model,(res,stat)=>{
          switch (stat.statusCode) {
            case 200:
              this.snackbar = true;
              if(this.welcome) {
                this.$router.push('/project/' + this.projectUrl + '/dashboard/');
              }
            return;
            case 400:
            case 500:
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
      console.log(error);
    },
    onClickBack:function() {
      this.$router.push('/project/' + this.projectUrl + '/member/');
    },
    onClickAddSection:function() {
      this.sections.push({
        value:{},
        errors:[]
      });
    },
    querySelections (v) {
      this.loading = true;
      this.query(v).then(records=>{
        this.sectionItems = records;
        this.loading = false;
      });
    },
    query:function(v) {
      return new Promise(function(resolve, reject) {
        io.socket.get(`/project/${this.projectUrl}/section/query?query=${v}`,(res,jwres)=>{
          switch (jwres.statusCode) {
            case 200:
            resolve(res);
            break;
            default:
            console.log(jwres.statusCode);
            console.log(res);
            reject(res);
          }
        });
      }.bind(this));
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
  watch: {
    sectionSearch (val) {
      val && this.querySelections(val)
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
      sections:[

      ],
      id:0,
      valid: true,
      showsButton:true,
      snackbar:false,
      mode:'',
      loading: false,
      sectionItems: [],
      sectionSearch: null,
    }
  }
}
</script>
