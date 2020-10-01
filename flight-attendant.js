const assert = require('assert');
const ldapquery = require ("./lib/ldap-query");
const email = require("./lib/email");
const w3capi = require('node-w3capi');
const fetch = require('node-fetch');
const { nextTick } = require('process');

const Twig = require('twig');
const { resolve } = require('path');
twig = Twig.twig;       // Render function

function welcome (userid, username, groupid, cb) {
  ldapquery.searchMail(userid)
  .then (res => {
    address = res ;
    getGroupInfo(groupid)
    .then (group => {
      // craftMessage(username, group, address)
      if (process.env.NODE_ENV == 'debug') {
        console.log("crafting message for %s %s joining group %s (%s)", username, address, group.name, group.id);
      }
      let mail = {};
      if (process.env.NODE_ENV == 'production') {
        mail = { to: address, from: "carine+onboarding@w3.org" }
      } else {
        mail = { to: "carine@w3.org", from: "carine+test@w3.org" }
      }
      mail.subject = "[W3C onboarding] Welcome to the " + group.name ;
      getGroupTemplate(group.id)
      .then (template => {
        var t = twig({
          data: template
        });
        mail.text = t.render( { group: group } )
        if (mail.text != ''){ // do not send empty messages
          email.email(mail)
          .then ( res => { cb (null,'ok'); })
          .catch (err => { console.log (err); cb(err,'error'); });
          } else {
            cb (null,'ok');
          }
      })
      .catch (err => { 
        console.log ('email template not found');
        mail = { 
          to: "carine@w3.org",
          from: "carine+onboarding@w3.org",
          subject: "alert",
          text: "no template found! system is borken or GH is down!" 
        }
        email.email(mail)
        .then ( res => { cb (null,'ok'); })
        .catch (err => { console.log (err); cb(err,'error'); });
      })  
    })
  })
  .catch( err => console.log(err) ); 
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

function getGroupTemplate(groupid){
  return new Promise(function (resolve, reject) {
    var r ;
    fetch('https://raw.githubusercontent.com/w3c/onboarding/master/template/'+groupid)
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