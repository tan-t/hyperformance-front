/**
 * SectionMember.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    member_id:{
      required:true
    },
    section_id: {
      required:true
    },
    project_url:{
      required:true
    }
  }
};
