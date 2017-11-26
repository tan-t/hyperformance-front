/**
 * Invitation.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const uuid = require('node-uuid');

module.exports = {

  attributes: {
    type:{
      required:true,
      type:'string',
      enum:['COMPANY','PROJECT']
    },
    url:{
      type:'string',
      required:true
    },
    token: {
      required:true,
      unique:true,
      type: 'text',
      defaultsTo: function() {
        return uuid.v4();
      }
    },
    valid:{
      type:'boolean',
      defaultsTo:function(){
        return true;
      }
    },
    means: {
      type:'string',
      enum:['APPLICATION','MAIL','PUBLIC_LINK'],
      required:true
    }
  }
};
