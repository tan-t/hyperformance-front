/**
 * ProjectMemberController
 *
 * @description :: Server-side logic for managing Projectmembers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	show:function(req,res) {
		var projectUrl = req.param('projectUrl');
		var id = req.param('id');
		ProjectMemberService.load(projectUrl,id).then((member)=>{
			if(!member) {
				return res.notFound();
			}
			return res.ok(member);
		}).catch(err=>{
			res.negotiate(err);
		})
	},
	update:function(req,res) {
		var projectUrl = req.param('projectUrl');
		var id = req.param('id');
		var body = req.body;
		ProjectMemberService.update(projectUrl,id,body).then(member=>{
			if(!member) {
				return res.notFound();
			}
			return res.ok(member);
		}).catch(err=>{
			res.negotiate(err);
		})
	},
};
