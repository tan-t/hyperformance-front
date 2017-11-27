/**
 * ProjectController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create:function(req,res) {
		Project.create(req.body).exec((err,created)=>{
			if(err) {
				return res.negotiate(err);
			}

			new Promise(function(resolve, reject) {
				User.findOne({id:req.session.passport.user}).exec((err,user)=>{
					if(err) return reject(err);
					return resolve(user);
				});
			}).then((joined)=>{
				ProjectMember.create({project_url:created.url,user_id:joined.id,member_name:joined.username,member_name_sortable:joined.username}).exec((err,member)=>{
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
	show:function(req,res) {
		var projectUrl = req.param('projectUrl');
		Project.findOne({url:projectUrl}).exec((err,project)=>{
			if(err) {
				return res.negotiate(err);
			}
			return res.ok(project);
		});
	},
	update:function(req,res) {
		res.serverError('not implemented yet.')
	},
	join:function(req,res) {
		var url = req.param('projectUrl');
		var token = req.body.token;

		InvitationService.validateJoinToProject(url,token).then(()=>{
			User.findOne({id:req.session.passport.user}).exec((err,user)=>{
				if(err){
					res.serverError(err);
					return;
				}
				InvitationService.joinToProject(user,url,token).then((member)=>{
					res.ok(member);
				});
			});
		}).catch((err)=>{
			res.forbidden(err);
		});
	},
	isMember:function(req,res) {
		var projectUrl = req.param('projectUrl');
		ProjectMember.findOne({user_id:req.session.passport.user,project_url:projectUrl}).exec((err,member)=>{
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
	member:function(req,res) {
		var projectUrl = req.param('projectUrl');
		ProjectMember.find({project_url:projectUrl}).exec((err,members)=>{
			if(err) return res.negotiate(err);
			return res.ok(members);
		});
	},
	invitation:function(req,res) {
		var projectUrl = req.param('projectUrl');
		InvitationService.showValidInvitationsToProject(projectUrl).then((invitations)=>{
			res.ok(invitations);
		}).catch(err=>{
			res.negotiate(err);
		});
	},
	index:function(req,res) {
		ProjectMember.find({user_id:req.session.passport.user}).exec((err,members)=>{
			if(err) {
				return res.negotiate(err);
			}
			var defers = members.map(m=>Promise.defer());

			members.forEach((member,inx)=>{
				Project.findOne({url:member.project_url}).exec((err,project)=>{
					if(err) {
						return defers[inx].reject(err);
					}
					return defers[inx].resolve(project);
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
