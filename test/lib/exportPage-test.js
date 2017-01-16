var expect = require('chai').expect;
var exportPage = require('../../lib/exportPage');

var config = {
  "confConfig": {
    "username": "test-user",
    "password": "test-user-pwd",
    "baseUrl":  "https://tools.publicis.sapient.com/confluence",
    "apiPath": "/rest/api"
  }
};

var dummyConfluencePageId = '530497630';
var dummyConfluencePageIdIncorrect = '53049763';

  describe('#exportPage', function () {

    it('should get/read page content by ID', function (done) {
      exportPage(dummyConfluencePageId, config, function(err, data) {
        expect(err).to.be.null;
        expect(data).not.to.be.null;
        expect(data.id).to.equal(dummyConfluencePageId);
        done();
      });
    });

    it('should not get/read page content by ID', function (done) {
      exportPage(dummyConfluencePageIdIncorrect, config, function(err, data) {
        expect(err).not.to.be.null;
        expect(data.id).to.be.undefined;
        done();
      });
    });

  });
