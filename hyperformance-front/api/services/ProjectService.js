module.exports = {
  isMember:function(userId,projectUrl) {
    return new Promise(function(resolve, reject) {
      ProjectMember.findOne({user_id:userId,project_url:projectUrl}).exec((err,member)=>{
        if(err) {
          reject({status:500,err});
          return;
        }
        if(!member) {
          reject({status:403});
          return;
        }
        resolve(member);
      });
    });
  }
}
