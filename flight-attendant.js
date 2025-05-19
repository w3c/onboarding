const assert = require('assert');
const ldapquery = require ("./lib/ldap-query");
const email = require("./lib/email");
const w3capi = require('node-w3capi');
const fetch = require('node-fetch');
const { nextTick } = require('process');

const Twig = require('twig');
const { resolve } = require('path');
twig = Twig.twig;       // Render function

function welcome(userid, username, groupid, cb) {
  ldapquery.searchMail(userid)
    .then(res => {
      address = res;
      getGroupInfo(groupid)
        .then(group => {
          // craftMessage(username, group, address)
          if (process.env.NODE_ENV == 'debug') {
            console.log("crafting message for %s %s joining group %s (%s)", username, address, group.name, group.id, group.shortname);
          }
          let mail = {};
          switch (group.type) {
              case 'working group':
		type='wg';
                break;
              case 'interest group':
		type='ig';
                break;
              case 'community group':
		type='cg';
                break;
              case 'business group':
		type='bg';
                break;
              default:
                console.log('unknown group type');
	  }
          getCc(group.id)
            .then(cc => {
              if (process.env.NODE_ENV == 'production') {
                mail = { to: address, from: "W3C group onboarding <cb+onboarding@w3.org>", cc: cc };
              } else {
                console.log("Cc: %s\n", cc);
                mail = { to: "carine@w3.org", from: "carine+test@w3.org" };
                mail.headers = { 'x-onboarding-test-cc' : cc } ;
              }
              mail.subject = "[W3C onboarding] Welcome to the " + group.name;	              mail.headers = { 'Auto-Submitted' : 'auto-generated', 'Precedence': 'bulk' };
              getGroupTemplate(group.shortname, type)
                .then(template => {
                  var t = twig({
                    data: template
                  });
                  mail.text = t.render({ group: group })
                  if (mail.text != '') { // do not send empty messages
                    email.email(mail)
                      .then(res => { cb(null, 'ok'); })
                      .catch(err => { console.log(err); cb(err, 'error'); });
                  } else {
                    cb(null, 'ok');
                  }
                })
                .catch(err => {
                  console.log('email template not found');
                  mail = {
                    to: "carine@w3.org",
                    from: "carine+onboarding@w3.org",
                    subject: "alert",
                    text: "no template found! system is borken or GH is down!"
                  }
                  email.email(mail)
                    .then(res => { cb(null, 'ok'); })
                    .catch(err => { console.log(err); cb(err, 'error'); });
                })
            })
            .catch(err => { console.log(err); cb(err, 'error'); });
        })
        .catch(err => { console.log(err); cb(err, 'error'); });
    })
    .catch(err => { console.log(err); cb(err, 'error'); });
} 

function getGroupInfo(group){
  return new Promise(function (resolve, reject) {
    var r ;
    w3capi.apiKey = process.env.APIKEY;
    w3capi.group(group).fetch((err, data) => {
      if (err){ 
        reject(err);
        console.error('error: ' + err.message);
      } 
      r = data;
      resolve(r) ;
      }); 
    });
}

function getCc(group){
  return new Promise(function (resolve, reject) {
    var r ;
    w3capi.apiKey = process.env.APIKEY;
    w3capi.group(group).chairs().fetch({embed: true}, (err, chairs) => {
      if (err){ 
        console.error('error: ' + err.message);
        reject(err);
      } 
      w3capi.group(group).teamcontacts().fetch({embed: true}, (err, tcs) => {
        if (err){ 
          console.error('error: ' + err.message);
          reject(err);
        } 
        Promise.all(chairs.map(chair => ldapquery.searchMail(chair.id)))
        .then (chairs => {
          r = chairs; 
          Promise.all(tcs.map(tc => ldapquery.searchMail(tc.id)))
          .then (tcs => {
            r = r + ',' + tcs;
            resolve(r) ;
          })
          .catch (err => {
           console.log ("team contacts not found:\n" + err);
           resolve(r) ;
          });
        })
        .catch ( err => {
           console.log ("chairs not found;\n" + err);
           r = 'carine+onboarding@w3.org';  // this will be the case for CGs with a template
           resolve(r) ;
        })  
      }); 
    });
  });  
}

function getGroupTemplate(shortname, type){
  return new Promise(function (resolve, reject) {
    var r ;
    fetch('https://raw.githubusercontent.com/w3c/onboarding/master/template/'+type+'/'+shortname)
    .then( res => {
      if (res.status === 200){
        r = res.text();
        resolve(r);
      } else {
        console.log("custom template:" + res.status + " " + res.statusText);
        fetch ('https://raw.githubusercontent.com/w3c/onboarding/master/template/default')
        .then( res => {
          console.log("default template:" + res.status + " " + res.statusText);
          if (res.status === 200){
            r = res.text();
            resolve(r);
          } else {
            reject(err);
          }
        })
        .catch( err => {
        console.log(err);
        reject( err);
        }) 
      }  
    })
    .catch( err => {
      console.log(err);
      reject( err);
    });  
  });
}

exports.welcome = welcome; 
