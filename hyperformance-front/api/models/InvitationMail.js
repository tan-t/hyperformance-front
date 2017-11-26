/**
 * InvitationMail.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    invitation_id:{
      required:true
    },
    email:{
      type:'string',
      required:true
    },
    due_date:{
      type:'date',
      required:true
    },
    from_user:{
      required:true
    },
    status:{
      type:'string',
      enum:['SENT','JOINED'],
      defaultsTo:() => {
        return 'SENT';
      }
    }
  }
};
