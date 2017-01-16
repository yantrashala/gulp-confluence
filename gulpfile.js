var gulp = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');

gulp.task('mochaTest', function (cb) {
  gulp.src(['lib/*.js', 'utils/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function () {
      gulp.src(['test/**/*-test.js'])
        .pipe(mocha({timeout: 5000}))
        .pipe(istanbul.writeReports())
        .on('end', cb);
    });
});

// default task
gulp.task('default', ['mochaTest'], function () {
  process.exit(0);
});
