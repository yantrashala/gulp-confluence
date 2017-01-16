function processResponse(err, res, cb) {
  if (err || !res || !res.body) {
    cb(err, res);
  }
  else {
    cb(err, res.body);
  }
}

module.exports = processResponse;
