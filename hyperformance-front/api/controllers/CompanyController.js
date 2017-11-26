/**
 * CompanyController
 *
 * @description :: Server-side logic for managing companies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	join:function(req,res) {
		var url = req.param('companyUrl');
		var token = req.body.token;

		InvitationService.validateJoinToCompany(url,token).then(()=>{
			User.findOne({id:req.session.passport.user}).exec((err,user)=>{
				if(err){
					res.serverError(err);
					return;
				}
				InvitationService.joinToCompany(user,url,token).then((member)=>{
					res.ok(member);
				});
			});
		}).catch((err)=>{
			res.forbidden(err);
		});
	},
	isMember:function(req,res) {
		var companyUrl = req.param('companyUrl');
		CompanyMember.findOne({user_id:req.session.passport.user,company_url:companyUrl}).exec((err,member)=>{
			if(err){
				res.serverError(err);
				return;
			}
			if(!member) {
				res.forbidden('access forbidden');
				return;
			}
			res.ok();
		});
	},
	show:function(req,res) {
		var companyUrl = req.param('companyUrl');
		Company.findOne({url:companyUrl}).exec((err,company)=>{
			if(err) {
				return res.negotiate(err);
			}
			return res.ok(company);
		});
	},
	create:function(req,res) {
		Company.create(req.body).exec((err,created)=>{
			if(err) {
				return res.negotiate(err);
			}

			new Promise(function(resolve, reject) {
				User.findOne({id:req.session.passport.user}).exec((err,user)=>{
					if(err) return reject(err);
					return resolve(user);
				});
			}).then((joined)=>{
				CompanyMember.create({company_url:created.url,user_id:joined.id,member_name:joined.username,member_name_sortable:joined.username}).exec((err,member)=>{
					if(err) {
						return res.negotiate(err);
					}
					return res.created(created);
				});
			}).catch(err=>{
				res.negotiate(err);
			});
		});
	},
	update:function(req,res) {
		var companyUrl = req.param('companyUrl');
		Company.update({url:companyUrl},req.body).exec((err,updated)=>{
			if(err) {
				return res.negotiate(err);
			}
			return res.ok(updated);
		});
	},
	member:function(req,res) {
		var companyUrl = req.param('companyUrl');
		CompanyMember.find({company_url:companyUrl}).exec((err,members)=>{
			if(err) return res.negotiate(err);
			return res.ok(members);
		});
	},
	invitation:function(req,res) {
		var companyUrl = req.param('companyUrl');
		InvitationService.showValidInvitationsToCompany(companyUrl).then((invitations)=>{
			res.ok(invitations);
		}).catch(err=>{
			res.negotiate(err);
		});
	},
	index:function(req,res) {
		CompanyMember.find({user_id:req.session.passport.user}).exec((err,members)=>{
			if(err) {
				return res.negotiate(err);
			}
			var defers = members.map(m=>Promise.defer());

			members.forEach((member,inx)=>{
				Company.findOne({url:member.company_url}).exec((err,company)=>{
					if(err) {
						return defers[inx].reject(err);
					}
					return defers[inx].resolve(company);
				});
			});
			Promise.all(defers.map(defer=>defer.promise)).then((companies)=>{
				return res.ok(companies);
			}).catch((err)=>{
				res.negotiate(err);
			});
		});
	}
};
