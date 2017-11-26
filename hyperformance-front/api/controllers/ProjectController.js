/**
 * ProjectController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function(req,res) {
		var body = req.body;
		body.companyUrl = req.param('companyUrl');
		Project.create(body).exec((err,created)=>{
			if(err) {
				return res.negotiate(err);
			}
			return res.created(created);
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

};
