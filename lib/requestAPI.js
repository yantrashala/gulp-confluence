var https = require('https');
var fs = require('fs');
var validFilename = require('valid-filename');
var toMarkdown = require('to-markdown');
var upndown = require('upndown');
var valid;
var regEx = /(ac:|\/ac:|ri:|\/ri:)/g;
var und = new upndown();

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

  var req = https.request(options, function (res) {
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
          var htmlData = data.body.storage.value;
          //console.log('--data---',htmlData);
          htmlData = htmlData.replace(regEx,'');

          und.convert(htmlData, function(err, markdown) {
            if(err) { console.err(err); }
            else {
              console.log('------MD---------',markdown);
              writeStream = fs.createWriteStream('attachments\\'+filename);
              writeStream.write(markdown);
            }
          });
          //console.log('------data-------',data.body.storage.value);
          //console.log('------MD-------',toMarkdown(data.body.storage.value));
          //fs.writeFile('attachments\\'+filename, data.body.storage.value);
          //callback(null,filename +' saved locally');
          callback(null,'----------------created---------');
        }
        else{
          callback(null,data);
        }
      });
    }
    else{
      callback('Error',null);
    }
  });

  req.on('error', function (e) {
    console.error('Error',e);
    callback(e,null);
  });

  req.end();
}

module.exports = requestAPI;
