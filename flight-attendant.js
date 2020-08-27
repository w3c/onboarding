const assert = require('assert');
const ldapquery = require ("./ldap-query");


function welcome (userid, groupid, email){
  console.log(userid + ' has joined ' + groupid);

  const response = ldapquery.searchMail(userid)
  .then(response => console.log(response));
 
}

exports.welcome = welcome; 