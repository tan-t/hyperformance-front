module.exports = {
  isMember:function(userId,companyUrl) {
    return new Promise(function(resolve, reject) {
      CompanyMember.findOne({user_id:userId,company_url:companyUrl}).exec((err,member)=>{
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
