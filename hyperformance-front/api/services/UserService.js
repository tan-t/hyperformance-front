module.exports = {
  find: function(identifier) {
    return new Promise(function(resolve, reject) {
      User.findOne({
        or:[
          {username:identifier},
          {email:identifier}
        ]
      }).exec((err,user)=>{
        resolve(user);
      })
    });
  }
}
