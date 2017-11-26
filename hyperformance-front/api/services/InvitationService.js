module.exports = {
  inviteToCompany:function(from,toArray,dueDate,companyUrl) {
    return InvitationService.invite(from,toArray,dueDate,'COMPANY',companyUrl);
  },
  inviteToProject: function(from,toArray,dueDate,projectUrl) {
    return InvitationService.invite(from,toArray,dueDate,'PROJECT',projectUrl);
  },
  createPublicLinkToCompany: function(companyUrl) {
    return InvitationService.createPublicLink(companyUrl,'COMPANY');
  },
  createPublicLinkToProject: function(projectUrl) {
    return InvitationService.createPublicLink(projectUrl,'PROJECT');
  },
  createPublicLink: function(url,type) {
    return new Promise(function(resolve, reject) {
      Invitation.create({type,url,means:'PUBLIC_LINK'}).exec((err,invitation)=>{
        if(err) {
          reject(err);
          return;
        }
        resolve(`/${type.toLowerCase()}/join?invitation=${url}&token=${invitation.token}`);
      });
    });
  },
  invite: function(from,toArray,dueDate,type,url) {
    return new Promise(function(resolve, reject) {
      var defers = toArray.map(to=>Promise.defer());
      console.log('start invite people.')
      console.log(toArray);
      toArray.forEach((to,inx)=>{
        UserService.find(to).then(user=>{
          if (user) {
          Invitation.create({type,url,means:'APPLICATION'}).exec((err,invitation)=>{
              InvitationService.inviteExistingUser(from,user.id,dueDate,invitation).then(()=>{
                defers[inx].resolve();
              });
              console.log(`mailed to :${user.email} url:/${type.toLowerCase()}/join?invitation=${url}&token=${invitation.token}`);
              return;
            });
          } else {
          Invitation.create({type,url,means:'MAIL'}).exec((err,invitation)=>{
            InvitationService.inviteNotExistingUser(from,to,dueDate,invitation).then(()=>{
              defers[inx].resolve();
            });
            console.log(`mailed to :${to} url:/${type.toLowerCase()}/join?invitation=${url}&token=${invitation.token}`);
          });
          }
        });
      });

      Promise.all(defers.map(defer=>defer.promise)).then((applications)=>{
        resolve();
      });

    });
  },
  inviteExistingUser: function(from,to,dueDate,invitation) {
    return new Promise(function(resolve, reject) {
        ApplicationService.apply(from,[to],dueDate,{
          type:'INVITATION',
          businessId:invitation.id
        }).then(()=>{
          resolve();
        });
    });
  },
  inviteNotExistingUser: function(from,email,dueDate,invitation) {
    return new Promise(function(resolve, reject) {
      InvitationMail.create({invitation_id:invitation.id,email,from_user:from,due_date:dueDate}).exec((err,mail)=>{
        resolve();
      });
    });
  },
  showValidInvitationsToCompany:function(companyUrl) {
    return InvitationService.showValidInvitations('COMPANY',companyUrl);
  },
  showValidInvitations: function(type,url) {
    return new Promise(function(resolve, reject) {
      Invitation.find({type,url,means:['APPLICATION','MAIL'],valid:true}).exec((err,invitations)=>{
        if(err) {
          return reject(err);
        }
        resolve(invitations);
      });
    }).then((invitations)=>{
      return new Promise(function(resolve, reject) {
        ApplicationService.findByBusinessId('INVITATION',invitations.map(invitation=>invitation.id)).then(applications=>{
          invitations.forEach(invitation=>{
            invitation.application = applications.find(application=>application.business_id == invitation.id);
          });
          resolve(invitations);
        });
      });
    }).then((invitations)=>{
      return new Promise(function(resolve, reject) {
        InvitationMail.find({invitation_id:invitations.map(invitation=>invitation.id)}).exec((err,mails)=>{
          if(err) {
            return reject(err);
          }
          invitations.forEach(invitation=>{
            invitation.mail = mails.filter(mail=>mail.invitation_id == invitation.id);
          });
          resolve(invitations);
        });
      });
    }).then((invitations)=>{
      return invitations.map(toInvitationObject);
    }).then(invitationObjects=>{
      return new Promise(function(resolve, reject) {
        InvitationService.createUserMap(
          invitationObjects.map(obj=>obj.from)
          .concat(
            invitationObjects.filter(obj=>obj.means=='APPLICATION').map(obj=>obj.to)
          )
        ).then(userMap=>{
          resolve(invitationObjects.map(obj=>{
            obj.from = userMap[obj.from].email;
            if(obj.means == 'APPLICATION') {
              obj.to = userMap[obj.to].email;
            }
            return obj;
          }));
        });
      });
    });
  },
  joinToCompany: function(joined,url,token) {
    return new Promise(function(resolve, reject) {
      CompanyMember.create({company_url:url,user_id:joined.id,member_name:joined.username,member_name_sortable:joined.username}).exec((err,member)=>{
        if(err) {
          reject(err);
        }
        resolve(member);
      });
    }).then((member)=>{
      return new Promise(function(resolve, reject) {
      Invitation.update({token},{valid:false}).exec((err,result)=>{
        ApplicationService.findByBusinessId('INVITATION',result[0].id).then(applications=>{
          if(!applications || applications.length <= 0){
            InvitationMail.update({invitation_id:result[0].id},{status:'JOINED'}).exec((err,res)=>{
              resolve(member);
            });
          } else {
            ApplicationService.approve(joined.id,applications[0].id).then(()=>resolve(member));
          }
        });
      });
    });
  });
},
  validateJoinToCompany:function(url,token) {
    return new Promise(function(resolve, reject) {
      Invitation.findOne({token}).exec((err,invitation)=>{
        if(err) {
          reject(err);
          return;
        }

        if(!invitation) {
          reject('invalid token.')
          return;
        }

        if(invitation.type !== 'COMPANY' || invitation.url !== url) {
          reject('invalid url.');
        }

        if(!invitation.valid) {
          reject('the token is no longer valid.');
          return;
        }

        resolve();
      });
    });
  },
  createUserMap:function(userIds) {
    var uniqueIds = userIds.filter((id,inx,array)=>{
      return array.indexOf(id) == inx;
    });
    return new Promise(function(resolve, reject) {
      User.find({id:uniqueIds}).then(users=>{
        resolve(users.reduce((a,b)=>{a[b.id] = b; return a;},{}));
      }).catch(err=>{
        reject(err);
      });
    });
  }
}

const toInvitationObject = function(invitation) {
  switch (invitation.means) {
    case 'APPLICATION':
    invitation.from = invitation.application.routes[0].from_user;
    invitation.to = invitation.application.routes[0].to_user;
    invitation.dueDate = invitation.application.due_date;
    invitation.status = invitation.application.status;
    return invitation;
    case 'MAIL':
    invitation.from = invitation.mail[0].from_user;
    invitation.to = invitation.mail[0].email;
    invitation.status = invitation.mail[0].status;
    invitation.dueDate = invitation.mail[0].due_date;
    return invitation;
  }
};
