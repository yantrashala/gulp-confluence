var read = require('read');
var config = require('./config');
var requestAPI = require('./lib/requestAPI');
var async = require('async');
var chalk = require('chalk');

var username, password, confPageId;
var inputColor = chalk.cyan;
var dataColor = chalk.green;
var attachmentColor = chalk.magenta;
var errColor = chalk.red;

read({ prompt: inputColor('Username: '), silent: false }, function(er, uname) {
  username = 'apal4'; //uname;
  read({ prompt: inputColor('Password: '), silent: true }, function(er, pwd) {
    password = 'dell25inspiron@'; //pwd;
    read({ prompt: inputColor('Confluence Page ID: '), silent: false }, function(er, id) {
      confPageId = '530497630'; //'525937433'; //id;
      updateConfig(username, password);
      loop(confPageId, '');
    });
  });
});

function updateConfig(username, password){
  config.confConfig.username  = username;
  config.confConfig.password  = password;
}

function loop(confPageId, path){
  getAPIData(confPageId, saveMD, path, function(err, data){
    if (err) console.log(errColor(err));
    else {
      console.log(dataColor(data));
      getAttachments(confPageId, path, function(err, data){
        if(err) {
          console.log(errColor(err));
        }
        else{
          callChildPages(confPageId, path);
        }
      });
    };
  });
}

function getAPIData(confPageId, callMD, path, callback){
  var url = config.confConfig.apiPath + "/content/" + confPageId + "?expand=body.storage,version";
  requestAPI(confPageId, config, url, false, '', false, path, function(err,data){
    if(err) {
      callback(err, null);
    }
    else {
      data = JSON.parse(data);
      callMD(confPageId, data.title, url, path, function(err,data){
        if (err) callback(err, null);
        else callback(null, data);
      });
    }
  });
}

function saveMD(confPageId, title, url, path, callback){
  requestAPI(confPageId, config, url, false, title +'.md', true, path, function(err,data){
    if(err) {
      callback(err, null);
    }
    else {
      callback(null, data);
    }
  });
}

function getAttachments(confPageId, path, callback){
  var attachmentsURL = config.confConfig.apiPath + "/content/" + confPageId + "/child/attachment";
  requestAPI(confPageId, config, attachmentsURL, 'false', '', false, '', function(err,data1){
    if(err) {
      callback(err, null);
    }
    else{
      data1 = JSON.parse(data1);
      if(data1.results.length > 0){
        async.eachSeries(data1.results, function iteratee(result, cb) {
        if (result) {
          saveAttachment(confPageId, result._links.download, result.title, path, cb);
        }
        });
      }
      callback(null, data1);
    }
  });
}

function saveAttachment(confPageId, attachmentLink, title, path, callback){
  requestAPI(confPageId, config, attachmentLink, true, title, false, path, function(err,data){
    console.log(attachmentColor(data));
    callback();
  });
}

function callChildPages(confPageId, path){
  var childUrl = config.confConfig.apiPath + "/content/" + confPageId + "/child/page";
  requestAPI(confPageId, config, childUrl, false, '', false, '', function(err,data){
    if(err) console.log(errColor(err));
    else{
      data = JSON.parse(data);
        if(data.results.length > 0){
          for (var index in data.results){
            loop(data.results[index].id, path + data.results[index].id + '\\');
          }
        }
      }
  });
}
