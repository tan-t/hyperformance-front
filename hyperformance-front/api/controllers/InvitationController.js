/**
 * InvitationController
 *
 * @description :: Server-side logic for managing Invitations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	inviteToCompany: function(req,res) {
		var body = req.body;
		var url = req.param('companyUrl');
		User.findOne({id:req.session.passport.user}).exec((err,user)=>{
			if(err){
				res.serverError(err);
				return;
			}
			InvitationService.inviteToCompany(user.id,body.toArray,body.dueDate,url).then(()=>{
				res.ok();
			});
		});
	},
	createPublicLinkToCompany:function(req,res) {
		var url = req.param('companyUrl');

		InvitationService.createPublicLinkToCompany(url).then((issuedLink)=>{
			res.ok(issuedLink);
		}).catch((err)=>{
			res.serverError(err);
		});
	},

	inviteToProject: function(req,res) {
		var body = req.body;
		var url = req.param('projectUrl');
		User.findOne({id:req.session.passport.user}).exec((err,user)=>{
			if(err){
				res.serverError(err);
				return;
			}
			InvitationService.inviteToProject(user.id,body.toArray,body.dueDate,url).then(()=>{
				res.ok();
			});
		});
	},
	createPublicLinkToProject:function(req,res) {
		var url = req.param('projectUrl');

		InvitationService.createPublicLinkToProject(url).then((issuedLink)=>{
			res.ok(issuedLink);
		}).catch((err)=>{
			res.serverError(err);
		});
	}
};
