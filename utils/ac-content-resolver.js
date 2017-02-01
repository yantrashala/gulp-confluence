var Promise = require('bluebird');
var acContentTokenizer = require('./ac-content-tokenizer');

var resolveAcTags = function (layoutHTML, tagHandlerFn, req, cb) {
  var layoutJSON = acContentTokenizer(layoutHTML);
  // Parallel API calls . serial concatenations of the response
  Promise.map(layoutJSON.tokens, function (token) {
    if (token.type !== 'ac') {
      return token.value;
    }
    else{
      if(token.value.tag === 'image'){
        return imageTagHandler(token.value.tag,token);
      }
      if(token.value.tag === 'structured-macro' || token.value.tag === 'link'){
        return attachmentHyperlink(token.value.tag,token);
      }
      else{
        return token.value;
      }
    }
  })
  .then(function (result) {
    //  initialize with empty string to avoid the undefined text to be appended to the resolved text
    var resolvedHTML = '';
    result.forEach(function (data) {
      if(data)
        resolvedHTML += data.toString();
      else
        resolvedHTML += "";
    });
    cb(null, resolvedHTML);
  })
  .catch(function (error) {
    cb(error);
  });
};

function imageTagHandler(tagType, token){
  var regex = /(ri:filename=")(.*?)(")/;
  var regexSearch = new RegExp(regex.source,'');
  var imageName = regexSearch.exec(token.value.body);
  var imgName = imageName[2];
  var height = token.value.attrs['ac:height'];
  var imageTag = '<img src="'+imgName+'" height="'+height+'" alt="'+imgName+'" />"';
  return Promise.resolve(imageTag);
}

function attachmentHyperlink(tagType, token){
  var regex = /(ri:filename=")(.*?)(")/;
  var regexSearch = new RegExp(regex.source,'');
  var attachmentName = regexSearch.exec(token.value.body);
  var attName = attachmentName[2];
  var attachmentTag = '<a href="'+attName+'">'+attName+'</a>';
  return Promise.resolve(attachmentTag);
}

module.exports = resolveAcTags;
