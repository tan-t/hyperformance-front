module.exports = {
  getUser : function(req,res) {
    console.log(req.session);
    User.findOne({id:req.session.passport.user}).exec((err,user)=>{
      if(err){
        res.negotiate(err);
        return;
      }
      res.json(user);
    });
  }
}
