var read = require('read');
var config = require('./config');
var requestAPI = require('./lib/requestAPI');
var async = require('async');
var chalk = require('chalk'); // Added chalk

var username, password, confPageId, url, childUrl;
var inputColor = chalk.cyan;
var dataColor = chalk.green;
var attachmentColor = chalk.magenta;
var errColor = chalk.red;

read({ prompt: inputColor('Username:'), silent: false }, function(er, uname) {
  username = uname;
  read({ prompt: inputColor('Password:'), silent: true }, function(er, pwd) {
    password = pwd;
    read({ prompt: inputColor('Confluence Page ID:'), silent: false }, function(er, id) {
      confPageId = id;
      updateConfig(username, password);
      loop();
    });
  });
});

function updateConfig(username, password){
  config.confConfig.username  = username;
  config.confConfig.password  = password;
}

function loop(){
  getAPIData();
  getAttachments();
  callChildPages();
}

function getAPIData(){
  url = config.confConfig.apiPath + "/content/" + confPageId + "?expand=body.storage,version";
  requestAPI(confPageId, config, url, false, '', false, function(err,data){
    if(err) {
      console.log(errColor(err));
      return err;
    }
    else {
      data = JSON.parse(data);
      saveHTML(data.title);
    }
  });
}

function saveHTML(title){
  requestAPI(confPageId, config, url, false, title +'.html', true, function(err,data){
    if(err) console.log(errColor(err));
    else {
      console.log(dataColor(data));
    }
  });
}

function getAttachments(){
  var attachmentsURL = config.confConfig.apiPath + "/content/" + confPageId + "/child/attachment";
  requestAPI(confPageId, config, attachmentsURL, 'false', '', false, function(err,data1){
    if(err) console.log(errColor(err));
    else{
      data1 = JSON.parse(data1);
      if(data1.results.length > 0){
        async.eachSeries(data1.results, function iteratee(result, callback) {
        if (result) {
          saveAttachment(result._links.download,result.title,callback);
        }
        });
      }
    }
  });
}

function saveAttachment(attachmentLink, title, cb){
  requestAPI(confPageId, config, attachmentLink, true, title, false, function(err,data){
    console.log(attachmentColor(data));
    cb();
  });
}

function callChildPages(){
  childUrl = config.confConfig.apiPath + "/content/" + confPageId + "/child/page";
  requestAPI(confPageId, config, childUrl, false, '', false, function(err,data){
    data = JSON.parse(data);
    if(data.results.length > 0){
      async.eachSeries(data.results, function iteratee(result, callback) {
      if (result) {
        confPageId = result.id;
        loop();
        callback();
      }
      });
    }
  });
}
