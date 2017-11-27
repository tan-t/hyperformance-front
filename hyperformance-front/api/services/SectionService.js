module.exports = {
  register: function(projectUrl,body) {
    return new Promise(function(resolve, reject) {
      var sectionCreate = Promise.defer();

      Section.create(toSectionModel(projectUrl,body)).exec((err, created) => {
        sectionCreate.resolve(created);
      });

      sectionCreate.promise.then(created => {
        var structureFind = Promise.defer();
        var sectionStructure = toSectionStructureModel(body, created.id);

        SectionStructure.find({
          decendant: sectionStructure.ancestor
        }).exec((err2, ancestors) => {
          structureFind.resolve({
            created,
            ancestors
          });
        });
        return structureFind.promise;
      }).then((resolved) => {
        var ancestors = resolved.ancestors;
        var created = resolved.created;

        var depth = ancestors.length;

        // 自分自身も子とみなす。
        ancestors.push({
          ancestor: created.id,
          decendant: created.id,
          depth: -1
        });
        var defers = ancestors.map(ancestor => (Promise.defer()));
        ancestors.forEach((ancestor, inx) => {
          var computedDepth = ancestor.depth + 1;
          SectionStructure.create({
            ancestor: ancestor.ancestor,
            decendant: created.id,
            depth: computedDepth
          }).exec((err3, createdStructure) => {
            defers[inx].resolve(createdStructure);
          });
        });

        Promise.all(defers.map(defer => defer.promise)).then((createdStructures) => {
          resolve(created);
        });
      });
    });
  },

  show: function(projectUrl, id) {
    var postProcess = function(resolved) {
      return new Promise(function(resolve, reject) {
        resolved.ancestors = [rootAncestor(projectUrl)].concat(resolved.ancestors);
        console.log(resolved);
        resolve(resolved);
      });
    }

    var process = function(projectUrl, id) {
      if (!id || id == 0) {
        return new Promise(function(resolve, reject) {
          Section.find({
            project_url: projectUrl
          }).exec((err, sections) => {
            resolve({
              section: rootAncestor(projectUrl),
              ancestors: [],
              decendants: sections
            });
          });
        });
      }


      return new Promise(function(resolve, reject) {
        Section.findOne({
          id,project_url:projectUrl
        }).exec((err, section) => {
          console.trace({projectUrl,id});

          if(!section) {
            reject('invalid project id.');
            return;
          }

          var decendantsDefer = Promise.defer();
          var ancestorsDefer = Promise.defer();

          // get decendants
          SectionStructure.find({
            ancestor: id,
            depth: 1
          }).exec((err, structures) => {
            var defers = structures.map(structure => (Promise.defer()));
            structures.forEach((structure, inx) => {
              Section.findOne({
                id: structure.decendant
              }).exec((err, decendant) => {
                defers[inx].resolve(decendant);
              });
            });

            Promise.all(defers.map(defer => defer.promise)).then((decendants) => {
              decendantsDefer.resolve(decendants);
            });
          });


          // get ancestors
          SectionStructure.find({
            decendant: id
          }).exec((err, structures) => {
            var defers = structures.map(structure => (Promise.defer()));
            structures.forEach((structure, inx) => {
              Section.findOne({
                id: structure.ancestor
              }).exec((err, ancestor) => {
                defers[inx].resolve(ancestor);
              });
            });

            Promise.all(defers.map(defer => defer.promise)).then((ancestors) => {
              ancestorsDefer.resolve(ancestors);
            });
          });
          Promise.all([decendantsDefer.promise, ancestorsDefer.promise]).then(results => {
            resolve({
              section,
              decendants: results[0],
              ancestors: results[1]
            });
          });
        });
      });
    }
    return process(projectUrl, id).then(postProcess);
  },

  loadSectionMembers:function(projectUrl,sectionId) {
    return new Promise(function(resolve, reject) {
      SectionStructure.find({ancestor:sectionId}).then((ancestors)=>{
        SectionMember.find({project_url:projectUrl,section_id:ancestors.map(ancestor=>ancestor.decendant)})
        .then(sectionMembers=>{
          Promise.all([
            ProjectMember.find({id:sectionMembers.map(sectionMember=>sectionMember.member_id)}),
            SectionService.aggregateSectionsToMembers(sectionMembers)
          ]).then((results)=>{
              var projectMembers = results[0];
              var memberSectionMap = results[1];
              projectMembers.forEach(projectMember=>{
                projectMember.sections = memberSectionMap[projectMember.id];
              });
              resolve(projectMembers);
          }).catch(err=>{
            reject(err);
          });
        }).catch(err=>{
          reject(err);
        });
      }).catch(err=>{
        reject(err);
      });
    });
  },
  aggregateSectionsToMembers: function(sectionMembers){
    var map = {};
    sectionMembers.forEach(sectionMember=>{
      var arr = map[sectionMember.member_id];
      if(!arr) {
        arr = [];
        map[sectionMember.member_id] = arr;
      }

      arr.push(sectionMember.section_id);
    });
    return Section.find({id:sectionMembers.map(sectionMember=>sectionMember.section_id).filter((id,inx,arr)=>{
      return arr.indexOf(id) == inx;
    })}).then((sections)=>{
      Object.keys(map).forEach((memberId)=>{
        map[memberId] = map[memberId].map(sectionId=>{
          return sections.find(section=>section.id == sectionId);
        });
      });
      return map;
    });
  },
  query:function(projectUrl,query) {
    return Section.find({project_url:projectUrl,name:{'contains':query}})
      .then(records=>{
        return records.map(toSectionBean);
    });
  }
}

const toSectionModel = function(projectUrl,body) {
  return {
    id: body.id,
    project_url: projectUrl,
    name: body.name
  }
}

const toSectionStructureModel = function(body, id) {
  return {
    ancestor: body.parent,
    decendant: id
  }
}

const rootAncestor = function(projectUrl) {
  return {
    id: 0,
    project_url: projectUrl,
    name: 'root'
  }
}

const toSectionBean = function(section) {
  return {
    label:section.name,
    value:{
      label:section.name,
      id:section.id
    }
  };
}
