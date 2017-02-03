var https = require('https');
var fs = require('fs');
var fse = require('fs-extra');
var resolveAcTags = require('../utils/ac-content-resolver');
var md = require('html-md-optional_window');
var sanitize = require('sanitize-filename');

var valid;

var requestAPI = function(confPageId, config, url, attachmentFlag, filename, isMD, path, callback){
  var options = {
    hostname: config.confConfig.hostname,
    port: config.confConfig.port,
    path: '/confluence' + url,
    auth: config.confConfig.username + ':' + config.confConfig.password,
    method: 'GET'
  };
  var writeStream;

  if(attachmentFlag === true || isMD === true){
    filename = sanitize(filename);
    dir = 'attachments\\'+ path;
    fse.ensureDir(dir, function (err,data) {
      if (err) console.log(err)
      else {
        writeStream = fs.createWriteStream('attachments\\'+ path + filename);
      }
    });
  }

    var req = https.request(options, function (response) {
      (function(res){
        if(res.statusCode === 401) { callback('Authentication failed !!!',null); }
        else if(res.statusCode === 403) { callback('You are unauthorized !!!',null); }
        else if(res.statusCode === 200){
          var data = "";
          res.on('data', function (d) {
            if(attachmentFlag === true ){
              writeStream.write(d);
            }
            else {
              data = data + d;
            }
          });
          res.on('end', function () {
            if(attachmentFlag === true){
              writeStream.end();
              callback(null,filename +' Attachment saved locally');
            }
            else if(isMD === true){
              data = JSON.parse(data);
              resolveAcTags(data.body.storage.value, null, null, function(err,data){
                data = md(data);
                fs.writeFile('attachments\\'+ path + filename, data);
                callback(null,filename +' saved locally');
              });
            }
            else{
              callback(null,data);
            }
          });
        }
        else{
          callback('Invalid Confluence ID !!!',null);
        }

      })(response);
    });

    req.on('error', function (e) {
      console.error('Error',e);
      callback(e,null);
    });

    req.end();
}

module.exports = requestAPI;
