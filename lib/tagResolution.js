var fs = require('fs');
var acTokenizer = require('../utils/ac-content-tokenizer');
var resolveAcTags = require('../utils/ac-content-resolver');

fs.readFile(__dirname + '/../attachments/Dummy file for gulp-confluence.html', (err, data) => {
  if (err) console.log(err);
  else{
    console.log('----before acTokenizer-----',data.toString('utf8'));
    resolveAcTags(data, null, null, function(err,data){
      console.log('------after resolveAcTags----',data);
    });
  }
});
