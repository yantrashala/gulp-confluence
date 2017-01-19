var read = require('read');
var config = require('./config');
var requestAPI = require('./lib/requestAPI');
var async = require('async');

var username, password, confPageId, url;

read({ prompt: 'Username: ', silent: false }, function(er, username) {
  username = username;
  read({ prompt: 'Password: ', silent: true }, function(er, password) {
    password = password;
    read({ prompt: 'Confluence Page ID: ', silent: false }, function(er, confPageId) {
      confPageId = confPageId;
      url = config.confConfig.apiPath + "/content/" + confPageId + "?expand=body.storage,version";
      updateConfig(username, password);
      requestAPI(confPageId, config, url, false, '', function(err,data){
        if(err) console.log(err);
        else {
          data = JSON.parse(data);
          requestAPI(confPageId, config, url, true, data.title +'.html', function(err,data11){
            console.log(data11);
          });
          var attachmentsURL = config.confConfig.apiPath + "/content/" + confPageId + "/child/attachment";
          requestAPI(confPageId, config, attachmentsURL, 'false', '', function(err,data1){
            data1 = JSON.parse(data1);
            if(data1.results.length > 0){
              async.eachSeries(data1.results, function iteratee(result, callback) {
              if (result) {
                requestAPI(confPageId, config, result._links.download, true, result.title, function(err,data2){
                  console.log(data2);
                  callback();
                });
              }
              });
            }
          });
        }
      });
    });
  });
});

function updateConfig(username, password){
  config.confConfig.username  = username;
  config.confConfig.password  = password;
}
