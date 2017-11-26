<template>
  <v-container>
  <abstract-form ref="form" :fields="fields" :disabled="action == 'none'"></abstract-form>
  <v-btn
   @click="onClickRegister"
   :disabled="!valid"
   v-if="showsButton"
   >
   JOIN
 </v-btn>
 <v-snackbar
   :timeout="6000"
   :bottom="true"
   v-model="snackbar"
 >
   Request Sent.
   <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>
 </v-snackbar>

 </v-container>
</template>

<script>
import AbstractForm from '@/components/bt/form/AbstractForm'

const baseUrl = '/project/'
const getUrl = function (action,opt_id) {
  var suffix = action;
  if(!!opt_id) {
    suffix = `${opt_id}/${action}`;
  }
  return baseUrl + suffix;
}

export default {
  name: 'ProjectJoin',
  components: {
    AbstractForm
  },

  beforeRouteEnter (route, redirect, next) {
    if(route.query.invitation) {
      next(vm=> {
        vm.getItem('url').model = route.query.invitation;
        vm.invitationToken = route.query.token;
      });
    } else {
      next(vm => vm.clear())
    }
  },

  beforeRouteUpdate (to, from, next) {
      if(to.query.invitation) {
        this.getItem('url').model = to.query.invitation;
        this.invitationToken = to.query.token;
      } else {
        this.clear();
      }
      next();
  },
  methods:
  {
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
    onClickRegister: function (e) {
      if (this.$refs.form.validate()) {
        this.fields.forEach(field=>{
          field.errors = [];
        });
        var model = this.createModel();
        model.token = this.invitationToken;
        io.socket.post(getUrl('join',model.url),model,(res,stat)=>{
          switch (stat.statusCode) {
            case 200:
              if(res.id) {
                this.$router.push(getUrl('member',model.url) + `/${res.id}/edit?mode=welcome`);
              } else {
                this.snackbar = true;
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
  },
  data () {
    return {
      fields: [
        {
          id:'url', label:'url', model:'',type: 'TEXT', rules:[
          (v) => !!v || 'Url is required',
         (value) => {
            const pattern = /[\w|\-]/
            return pattern.test(value) || 'Invalid url.'
          }
        ],
          required:true,
          errors:[]
        },
      ],
      invitationToken:'',
      valid: true,
      showsButton:true,
      snackbar:false
    }
  },
  props: ['action']
}
</script>
