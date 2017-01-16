var expect = require('chai').expect;
var processResponse = require('../../utils/processResponse');

var err = {};
var res = {};

describe('#processResponse', function () {

  it('should expect err not to be null', function (done) {
    err = {
      "res": {
        "data": {}
      }
    };
    processResponse(err, res, function(err, data) {
      expect(err).not.to.be.null;
      done();
    });
  });

  it('should expect res.body to be undefined', function (done) {
    err = {};
    res = {};
    processResponse(err, res, function(err, data) {
      expect(err).not.to.be.null;
      done();
    });
  });

  it('should expect res.body to be defined', function (done) {
    res = {
      "body": {
        "id": "530497630"
      }
    };
    processResponse(err, res, function(err, data) {
      expect(data).not.to.be.null;
      done();
    });
  });

});
