const ldapjs = require('ldapjs');
const assert = require('assert');

const env = require('dotenv').config({path: __dirname + '/.env'});
const LDAPUSER = process.env['LDAPUSER'] ;
const LDAPPASSWD = process.env['LDAPPASSWD'] ;

const client = ldapjs.createClient({url: 'ldaps://ldap.w3.org:636'});
client.bind('uid='+LDAPUSER+',ou=people,dc=w3,dc=org', LDAPPASSWD ,err => {
   assert.ifError(err);
});

function searchMail(userid, ){
  const searchOptions = {
    filter: '(&(ObjectClass=person)(employeeNumber='+ userid +'))',
    scope: 'sub',
    paged: true,
    sizeLimit: 200
  }  
  return new Promise(function (resolve, reject) {
    var r ;
    client.search("ou=people,dc=w3,dc=org",searchOptions,(err,res) => {
      assert.ifError(err);
      res.on('searchEntry', entry => {
        r =JSON.stringify(entry.object.mail);
        resolve(r);
      });
      res.on('error', err => {
        reject(err);
        console.error('error: ' + err.message);
      });
      res.on('end', res => {
        if (res.status === 0) {
          resolve(r);
        } else {
          reject(new Error('non-zero status code: ' + res.status));
        }
        client.unbind(function(err) {
          assert.ifError(err);
        });
      });
    });  
  });  
};

exports.searchMail = searchMail; 
