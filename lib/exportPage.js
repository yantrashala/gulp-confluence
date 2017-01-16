var superagent = require('superagent');
var processResponse = require('../utils/processResponse');

var exportPage = function(id, config, callback){
  superagent
    .get(config.confConfig.baseUrl + config.confConfig.apiPath + "/content/" + id + "?expand=body.storage,version")
    .auth(config.confConfig.username, config.confConfig.password)
    .end(function(err, res){
      processResponse(err, res, callback);
    });
}

module.exports = exportPage;
