var read = require('read');
var config = require('./config');
var exportPage = require('./lib/exportPage');

var username, password, confPageId;

read({ prompt: 'Username: ', silent: false }, function(er, username) {
  username = username;
  read({ prompt: 'Password: ', silent: true }, function(er, password) {
    password = password;
    read({ prompt: 'Confluence Page ID: ', silent: false }, function(er, confPageId) {
      confPageId = confPageId;
      updateConfig(username, password);
      exportPage(confPageId,config,function(err,data){
        if(err) console.log(err.response.res.statusMessage);
        else console.log('---data from export----',data);
      });
    });
  });
});

function updateConfig(username, password){
  config.confConfig.username  = username;
  config.confConfig.password  = password;
}
