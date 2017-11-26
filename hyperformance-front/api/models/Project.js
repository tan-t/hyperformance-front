/**
 * Project.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name:{
      type:'string',
      required:true
    },
    email:{
      type:'string'
    },
    purpose:{
      type:'string'
    },
    url:{
      type:'string',
      required:true,
      unique:true
    },
    companyUrl: {
      type:'string',
      unique:true
    }
  }
};
