var htmlclean = require('htmlclean');
// NSI tag finder
var acRegex = /<(ac:[a-z-?]+)\b([^>]+[^\/>])?(?:\/|>([\s\S]*?)<\/\1)>/i;

// getAttributes
var regAttrs = /\b([^\s=]+)(=(('|")(.*?[^\\]|)\4|[^\s]+))?/ig;
var splitChunk;
var nsiParser;
var getAttributes;
var acRegexGlobalSearch;
var acTokenizer = function (html) {
  var parts;
  // Format incoming
  if (typeof (html) !== 'string') {
    html = (html || '').toString();
  }
  // Split the current string into parts,some including the NSI fragment
  // and then the bits in between Loop through and process each of the ESI fragments,
  // mapping them back to a parts array containing strings and the Promise objects
  parts = splitChunk(htmlclean(html));
  return {
    'tokens': parts
  };
};


// regex to search all instances of nsi
acRegexGlobalSearch = new RegExp(acRegex.source, 'gi');

/**
 * splitting chunk into an array of nsi tags and string
 * @param {String} chunk
 * @returns {Array}
 */
splitChunk = function (chunk) {
  var ind = 0;
  var match = acRegexGlobalSearch.exec(chunk);
  var outputArray = [];

  while (match) {
    outputArray.push({
      'type': 'string',
      'value': chunk.slice(ind, match.index)
    });

    ind = match.index + match[0].length;
    outputArray.push({
      'type': 'ac',
      'value': acParser(match[0])
    });
    match = acRegexGlobalSearch.exec(chunk);
  }
  outputArray.push({
    'type': 'string',
    'value': chunk.slice(ind, chunk.length)
  });

  return outputArray;
};

/**
 * nsiParser
 * It will parser the NSI tag and returns attributes and body
 * @param {String} str nsiTag
 * @returns {Object} tag: string, attr: Array, body: string
 */
acParser = function (str) {
  var tag;
  var attrs;
  var body;
  // Get Tag Attributes in an object
  var match = str.match(acRegex);

  // Is this a tag?
  if (!match) {
    return str;
  }

  // Reference the different parts of the tag
  tag = match[1].split(':')[1];
  attrs = getAttributes(match[2]);
  body = match[3];

  if (body) {
    //console.log('---body---',body);
    try
    {
      //body = JSON.parse(body);
    } catch (e) {
      body = {
        'text': ''
      };
    }
  }

  return {
    'tag': tag,
    'attrs': attrs,
    'body': body
  };
};

/**
 * get Attributes
 * @param {String} str
 * @returns {Object}
 */
getAttributes = function (str) {
  var m = regAttrs.exec(str);
  var r = {};
  while (m) {
    r[m[1]] = (m[5] !== undefined ? m[5] : m[3]);
    m = regAttrs.exec(str);
  }

  return r;
};

module.exports = acTokenizer;
