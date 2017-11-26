module.exports = {
  register: function(body) {
    return new Promise(function(resolve, reject) {
      var sectionCreate = Promise.defer();

      Section.create(toSectionModel(body)).exec((err, created) => {
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

  show: function(projectId, id) {
    var postProcess = function(resolved) {
      return new Promise(function(resolve, reject) {
        resolved.ancestors = [rootAncestor(projectId)].concat(resolved.ancestors);
        resolve(resolved);
      });
    }

    var process = function(projectId, id) {
      if (!id || id == 0) {
        return new Promise(function(resolve, reject) {
          Section.find({
            project_id: projectId
          }).exec((err, sections) => {
            resolve({
              section: rootAncestor(projectId),
              ancestors: [],
              decendants: sections
            });
          });
        });
      }


      return new Promise(function(resolve, reject) {
        Section.findOne({
          id,project_id:projectId
        }).exec((err, section) => {

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
    return process(projectId, id).then(postProcess);
  }

}

const toSectionModel = function(body) {
  return {
    id: body.id,
    project_id: body.projectId,
    name: body.name
  }
}

const toSectionStructureModel = function(body, id) {
  return {
    ancestor: body.parent,
    decendant: id
  }
}

const rootAncestor = function(projectId) {
  return {
    id: 0,
    project_id: projectId,
    name: 'root'
  }
}
