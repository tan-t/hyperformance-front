/**
 * SectionController
 *
 * @description :: Server-side logic for managing sections
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function(req,res) {
		console.trace('SectionController.create');
		var body = req.body;
		var projectUrl = req.param('projectUrl');
		SectionService.register(projectUrl,body).then((created)=>{
			res.json(created);
		}).catch(err=>{
			console.log(err);
			res.negotiate(err);
		});
	},
	show: function(req,res) {
		console.trace('SectionController.show');
		var id = req.param('id');
		var projectUrl = req.param('projectUrl');

		SectionService.show(projectUrl,id).then(json=>{
			res.ok(json);
		}).catch(err=>{
			res.negotiate(err);
		});
	},
	member: function(req,res) {
		console.trace('SectionController.member');
		var id = req.param('id');
		var projectUrl = req.param('projectUrl');

		if(!id || id == 0) {
			return res.ok([]);
		}

		SectionService.loadSectionMembers(projectUrl,id).then(json=>{
			res.ok(json);
		}).catch(err=>{
			res.negotiate(err);
		});
	},
	query:function(req,res) {
		console.trace('SectionController.query');
		var projectUrl = req.param('projectUrl');
		var query = req.query.query;
		SectionService.query(projectUrl,query).then(beans=>{
			res.json(beans);
		}).catch(err=>{
			res.negotiate(err);
		});
	}
};
