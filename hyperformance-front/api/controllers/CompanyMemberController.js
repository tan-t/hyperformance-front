/**
 * CompanyMemberControllerController
 *
 * @description :: Server-side logic for managing Companymembercontrollers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	show:function(req,res) {
		var companyUrl = req.param('companyUrl');
		var id = req.param('id');
		CompanyMember.findOne({id}).exec((err,member)=>{
			if(err) {
				res.serverError(err);
				return;
			}
			if(!member || member.company_url != companyUrl) {
				res.notFound();
				return;
			}
			res.json(member);
		});
	},
	update:function(req,res) {
		var companyUrl = req.param('companyUrl');
		var id = req.param('id');
		var body = req.body;
		CompanyMember.findOne({id}).exec((err,member)=>{
			if(err) {
				res.serverError(err);
				return;
			}
			if(!member || member.company_url != companyUrl) {
				res.notFound();
				return;
			}
			CompanyMember.update({id},body).exec((err,updated)=>{
				if(err) {
					res.serverError(err);
					return;
				}
				res.ok(updated);
			});
		});
	},
};
