/**
 * ScriptController
 *
 * @description :: Server-side logic for managing scripts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	show:function(req,res) {
		var projectUrl = req.param('projectUrl');
		Script.findOne({project_url:projectUrl}).exec((err,script)=>{
			if(err) {
				return res.negotiate(err);
			}
			return res.ok(script);
		});
	},
	create:function(req,res) {
		Script.create(req.body).exec((err,created)=>{
			if(err) {
				return res.negotiate(err);
			}
			res.created(created);
		}
	},
};
