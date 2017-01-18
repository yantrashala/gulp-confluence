var https = require('https');
var fs = require('fs');

var requestAPI = function(confPageId, config, url, attachmentFlag, filename, callback){
  var options = {
    hostname: config.confConfig.hostname,
    port: config.confConfig.port,
    path: '/confluence' + url,
    auth: config.confConfig.username + ':' + config.confConfig.password,
    method: 'GET'
  };

  if(attachmentFlag === true && filename!== null){
    var writeStream = fs.createWriteStream(filename);
  }

  var req = https.request(options, function (res) {
    if(res.statusCode === 200){
      var data = "";
      res.on('data', function (d) {
        if(attachmentFlag === true && filename!== null){
          writeStream.write(d);
        }
        else {
          data = data + d;
        }
      });
      res.on('end', function () {
        console.log("------Done-----");
        if(attachmentFlag === true && filename!== null){
          writeStream.end();
          callback(null,'Attachment saved locally');
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
