<template>
  <v-container>
  <abstract-form ref="form" :fields="fields" :disabled="action == 'none'"></abstract-form>
  <v-btn
   @click="onClickRegister"
   :disabled="!valid"
   v-if="showsButton"
   >
   register
 </v-btn>
 </v-container>
</template>

<script>
import AbstractForm from '@/components/bt/form/AbstractForm'
import Postable from '@/mixins/Postable'
import AbstractFormManageable from '@/mixins/AbstractFormManageable'

const baseUrl = '/user/'
const getUrl = function (action,opt_id) {
  var suffix = action;
  if(!!opt_id) {
    suffix = `${opt_id}/${action}`;
  }
  return baseUrl + suffix;
}
const loadData = function(param,cb) {
  if(!'id' in param){
    cb();
    return;
  }
  io.socket.get(getUrl('',param.id),(res)=>{
    cb(res);
  })
}

export default {
  name: 'UserForm',
  components: {
    AbstractForm
  },
  mixins:[Postable,AbstractFormManageable],
      beforeRouteEnter (route, redirect, next) {
        loadData(route.params, (data) => {
          next(vm => vm.initialize(data))
        })
    },
    
      beforeRouteUpdate (to, from, next) {
        loadData(to.params, (data) => {
          this.initialize(data)
          next()
        })
    },
  methods:
  {
    createModelInternal: function(model) {
      delete model.password2;
      return model;
    },
    initialize: function(model) {
      if(!model){
        this.clear();
        return;
      }
       this.setModel(model);
    },
    setModelInternal: function(model) {
      this.getItem('password2').model = this.getItem('password').model;
    },
    getForm : function() {
      return this.$refs.form;
    },
    onClickRegister: function (e) {
      if (this.getForm().validate()) {
        this.clearErrors();
        var model = this.createModel();
        this.post(getUrl(this.action,model.id),model,(res)=>{this.login(model.username,model.password);});
      }
    },
    login:function(identifier,password) {
      this.post('/auth/local',{identifier,password},
      (res)=>{
        var redirect = this.$route.query.redirect;
            if(!redirect){
              redirect = '/home/';
            }
            this.$router.push(redirect)
      },
      (error,statusCode)=>{
        this.errors = ['identifier and password not match.'];
      });
    },
    handleServerError: function(error) {
      this.setErrors(error.invalidAttributes);
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
      valid: true,
      showsButton:true
    }
  },
  props: ['action']
}
</script>
