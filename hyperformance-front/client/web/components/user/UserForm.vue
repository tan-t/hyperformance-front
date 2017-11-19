<template>
  <v-container>
  <abstract-form ref="form" :fields="fields" :disabled="action == 'none'"></abstract-form>
  <v-btn
   @click="onClickRegister"
   :disabled="!valid"
   >
   register
 </v-btn>
 </v-container>
</template>

<script>
import AbstractForm from '@/components/bt/AbstractForm'

const baseUrl = '/user/'
const getUrl = function (action,opt_id) {
  var suffix = action;
  if(!!opt_id) {
    suffix = `${opt_id}/${action}`;
  }
  return baseUrl + suffix;
}
const getPost = function(id,cb) {
  io.socket.get(getUrl('',id),(res)=>{
    cb(null,res);
  })
}

export default {
  name: 'UserForm',
  components: {
    AbstractForm
  },

  beforeRouteEnter (route, redirect, next) {
    if(!route.params.id){
      next();
      return;
    }

    getPost(route.params.id, (err, post) => {
      next(vm => vm.setData(err, post))
    })
  },

  beforeRouteUpdate (to, from, next) {
    this.post = null

    if(!to.params.id){
      next();
      return;
    }

    getPost(to.params.id, (err, post) => {
      this.setData(err, post)
      next()
    })
  },
  methods:
  {
    createModel: function() {
      var model = this.fields.reduce((a,b)=>{a[b.id] = b.model; return a;},{});
      delete model.password2;
      return model;
    },
    setData: function(err,model) {
      if(!err){
        this.setModel(model);
      }
    },
    setModel: function(model) {
      Object.keys(model).forEach(key=>{
        let field = this.fields.find(f=>f.id == key);
        if(!field){
          return;
        }
        field.model = model[key];
      });
      // べたがき...
      this.getItem('password2').model = this.getItem('password').model;
    },
    getItem: function(itemId) {
      return this.fields.find(field=>field.id == itemId);
    },
    onClickRegister: function (e) {
      if (this.$refs.form.validate()) {
        this.fields.forEach(field=>{
          field.errors = [];
        });
        var model = this.createModel();
        io.socket.post(getUrl(this.action,model.id),model,(res,stat)=>{
          switch (stat.statusCode) {
            case 200:
            this.$router.push(getUrl('',res.id));
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
    passwordCheck: function() {
      return this.getItem('password').model == this.getItem('password2').model ? true : 'password not match';
    }
  },
  data () {
    return {
      fields: [
        {
          id: 'username', label: 'username', model: '', type: 'TEXT',rules:[
          (v) => !!v || 'UserName is required'
        ],
      errors:[]
    },
        {
          id:'email', label:'email', model:'',type: 'TEXT', rules:[
         (v) => !!v || 'email is required',
         (value) => {
            const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          }
        ],
          errors:[]
      },
        {
          id: 'password',
          label: 'password',
          model: '',
          type: 'PASSWORD',
          password_visibility: false,
          rules:[
            (v) => !!v || 'password is required'
          ],
            errors:[]
        },
        {
          id: 'password2',
          label: 'password : for confirmation',
          model: '',
          type: 'PASSWORD',
          password_visibility: false,
          rules:[
            this.passwordCheck
          ],
            errors:[]
        }
      ],
      valid: true
    }
  },
  props: ['action']
}
</script>
