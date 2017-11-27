/**
 * Scene.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    project_url:{
      required:true
    },
    script_id:{
      required:true
    },
    from:{
      type:'integer',
      required:true
    },
    to:{
      type:'integer'
      required:true
    }
  }
};
