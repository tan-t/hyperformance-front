/**
 * SectionController
 *
 * @description :: Server-side logic for managing sections
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function(req,res) {
		var body = req.body;
		SectionService.register(body).then((created)=>{
			res.json(created);
		});
	},
	show: function(req,res) {
		var id = req.param('id');
		var projectUrl = req.param('projectUrl');
		Project.findOne({url:projectUrl}).exec((err,project)=>{
			if(err) {
				res.serverError(err);
				return;
			}
			if(!project) {
				res.notFound();
				return;
			}

			SectionService.show(project.id,id).then(json=>{
				res.json(json);
			});
		});

	}
};
