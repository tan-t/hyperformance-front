module.exports = function(req, res, next) {
  CompanyService.isMember(req.session.passport.user,req.param('companyUrl')).then((member)=>{
    next();
  }).catch((errObj)=>{
    switch (errObj.status) {
      case 403:
      return res.forbidden('You are not permitted to perform this action.');
      case 500:
      default:
      return res.serverError(errObj.err);
    }
  });
};
