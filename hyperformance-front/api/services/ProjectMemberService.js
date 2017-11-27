module.exports = {
  load:function(projectUrl,id) {
    return new Promise(function(resolve, reject) {
      Promise.all([
        ProjectMember.findOne({project_url:projectUrl,id}),
        SectionMember.find({project_url:projectUrl,member_id:id})
      ]).then(results=>{
        console.log(results);
        var member = results[0];
        var sectionRelations = results[1];

        var defers = sectionRelations.map(r=>Promise.defer());
        member.sections = [];

        sectionRelations.forEach((relation,inx)=>{
          ProjectMemberService.loadSectionBean(member,relation,defers[inx]);
        });

        Promise.all(defers.map(defer=>defer.promise)).then(()=>{
          resolve(member);
        }).catch(err=>{
          reject(err);
        });
      });
    });
  },
  loadSectionBean:function (projectMember,sectionRelation,defer) {
    Section.findOne({project_url:sectionRelation.project_url,id:sectionRelation.section_id}).then(section=>{
      projectMember.sections.push(
        mapToSectionBean(section)
      );
      defer.resolve()
    }).catch(err=>{
      defer.reject(err);
    });
  },
  update:function(projectUrl,id,model) {
    var sections = model.sections;
    delete model.sections;
    return new Promise(function(resolve, reject) {
      Promise.all([
        ProjectMember.update({project_url:projectUrl,id},model),
        ProjectMemberService.updateSectionMemberRelation(projectUrl,id,sections)
      ]).then((results)=>{
        resolve(results[0]);
      }).catch(err=>{
        reject(err);
      });
    });
  },

  updateSectionMemberRelation:function(projectUrl,memberId,sections) {
    console.log(sections);
    return SectionMember.destroy({project_url:projectUrl,member_id:memberId}).then(()=>{
      return Promise.all(
        sections.map(section=>SectionMember.create({project_url:projectUrl,member_id:memberId,section_id:section.value.id}))
      );
      return;
    });
  }
};

const mapToSectionBean = function(section) {
  return {
    label:section.name,
    value:{
      label:section.name,
      id:section.id
    }
  };
}
