var config = require('../config');
var requestAPI = require('./requestAPI');
var upndown = require('upndown');

var confPageId = '530497630';
var url, childUrl;
var regEx = /(ac:|\/ac:|ri:|\/ri:)/g;

var und = new upndown();

config.confConfig.username  = 'apal4';
config.confConfig.password  = 'dell25inspiron@';

url = config.confConfig.apiPath + "/content/" + confPageId + "?expand=body.storage,version";
requestAPI(confPageId, config, url, false, '', false, function(err,data){
  if(err) {
    console.log(err);
  }
  else {
    data = JSON.parse(data);
    saveHTML('abc');
    // var htmlData = data.body.storage.value;
    // //console.log('--data---',htmlData);
    // htmlData = htmlData.replace(regEx,'');
    // //console.log('--updated data---',htmlData);
    // //var acRegexGlobalSearch = new RegExp(regEx.source,'g');
    // //var match = acRegexGlobalSearch.exec(data.body.storage.value);
    //
    // und.convert(htmlData, function(err, markdown) {
    //   if(err) { console.err(err); }
    //   else {
    //     console.log('------MD---------',markdown);
    //     saveHTML('abc');
    //   }
    // });
  }
});

function saveHTML(title){
  requestAPI(confPageId, config, url, false, title +'.html', true, function(err,data){
    if(err) console.log(err);
    else console.log(data);
  });
}
