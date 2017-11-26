/**
 * Application.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    type:{
      type:'string',
      required:true
    },
    business_id:{
      required:true
    },
    status:{
      type:'string',
      enum:['UNPROCESSED','APPROVED','REJECTED']
    },
    due_date:{
      type:'date'
    },
    approver: {
      
    }
  }
};
