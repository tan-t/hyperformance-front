/**
 * ProjectMember.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    project_url:{
      type:'string',
      required:true
    },
    member_name:{
      type:'string'
    },
    member_name_sortable:{
      type:'string'
    },
    user_id : {
      required:true
    }
  }
};
