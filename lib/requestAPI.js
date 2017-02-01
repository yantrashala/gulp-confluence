var https = require('https');
var fs = require('fs');
var validFilename = require('valid-filename');
var resolveAcTags = require('../utils/ac-content-resolver');
var md = require('html-md-optional_window');

var valid;

var requestAPI = function(confPageId, config, url, attachmentFlag, filename, isHtml, callback){
  var options = {
    hostname: config.confConfig.hostname,
    port: config.confConfig.port,
    path: '/confluence' + url,
    auth: config.confConfig.username + ':' + config.confConfig.password,
    method: 'GET'
  };
  var writeStream;

  if(attachmentFlag === true && filename!== null || isHtml === true){
    valid = validFilename(filename);
    if(valid){
      writeStream = fs.createWriteStream('attachments\\'+filename);
    }
    else{
      callback('Invalid Filename',null);
    }
  }

    var req = https.request(options, function (response) {
      (function(res){
        if(res.statusCode === 200){
          var data = "";
          res.on('data', function (d) {
            if(attachmentFlag === true && valid === true){
              writeStream.write(d);
            }
            else {
              data = data + d;
            }
          });
          res.on('end', function () {
            if(attachmentFlag === true && valid === true){
              writeStream.end();
              callback(null,filename +' Attachment saved locally');
            }
            else if(isHtml === true && valid === true){
              data = JSON.parse(data);
              resolveAcTags(data.body.storage.value, null, null, function(err,data){
                data = md(data);
                fs.writeFile('attachments\\'+filename, data);
                callback(null,filename +' saved locally');
              });
            }
            else{
              callback(null,data);
            }
          });
        }
        else{
          callback('Error',null);
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
