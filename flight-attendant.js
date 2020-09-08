const assert = require('assert');
const ldapquery = require ("./lib/ldap-query");
const email = require("./lib/email");
const w3capi = require('node-w3capi');


function welcome (userid, username, groupid){

  ldapquery.searchMail(userid)
  .then (res => {
    address = res ;
    getGroupInfo(groupid)
    .then (group => craftMessage(username, group, address))
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

async function craftMessage(name,group,address){
  if (process.env.NODE_ENV == 'debug') {
    console.log("crafting message with params %s %s %s", name, group, address);
  }

  var mail = {};
  if (process.env.NODE_ENV == 'production') {
    mail = {
      to: address,
      from: "carine+onboarding@w3.org" }
  } else {
    mail = {
       to: "carine@w3.org",
       from: "carine@w3.org"
    }
  }

  mail.subject = "[W3C onboarding] Welcome to the " + group.name ;
  mail.text    = "Dear " + name + "\n Welcome to the " + group.name ;

  console.log (mail);
  //return email.email(mail);
}

exports.welcome = welcome; 