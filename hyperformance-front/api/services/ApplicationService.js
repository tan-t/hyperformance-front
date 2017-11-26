// common Application Framework
module.exports = {
  apply:function(from,toArray,dueDate,businessMaterial) {
    return new Promise(function(resolve, reject) {
      Application.create({due_date:dueDate,type:businessMaterial.type,business_id:businessMaterial.businessId,status:'UNPROCESSED'}).exec((err,application)=>{
        resolve(application);
      });
    }).then((application)=>{
      return new Promise(function(resolve, reject) {
        var defers = toArray.map(to=>Promise.defer());
        toArray.forEach((to,inx)=>{
          ApplicationRoute.create({from_user:from,to_user:to,application_id:application.id}).exec((err,route)=>{
            defers[inx].resolve(route);
          });
        });
        Promise.all(defers.map(defer=>defer.promise)).then((routes)=>{
          resolve(application);
        });
      });
  });
  },
  approve:function(approver,applicationId) {
    return ApplicationService.changeStatus(approver,applicationId,'APPROVED');
  },
  reject:function(approver,applicationId) {
    return ApplicationService.changeStatus(approver,applicationId,'REJECTED');
  },
  changeStatus:function(approver,applicationId,status) {
    return new Promise(function(resolve, reject) {
      Application.update({id:applicationId},{status,approver}).exec((err,application)=>{
        resolve(application);
      });
    });
  },
  findByBusinessId:function(type,businessId,opt_status) {
    return new Promise(function(resolve, reject) {
      var query = {
        type,
        business_id:businessId
      };
      if(opt_status){
        query.status = opt_status;
      }
      Application.find(query).exec((err,res)=>{
          resolve(res);
      });
    }).then((applications)=>{
      return new Promise(function(resolve, reject) {
        ApplicationRoute.find({application_id:applications.map(application=>application.id)}).exec((err,routes)=>{
          applications.forEach((application)=>{
            application.routes = routes.filter(route=>route.application_id == application.id);
          });
          resolve(applications);
        });
      });
    });
  }


}
