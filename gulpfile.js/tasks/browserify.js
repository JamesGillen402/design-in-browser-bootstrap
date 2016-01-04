var browserify   = require('browserify');
var browserSync  = require('browser-sync');
var watchify     = require('watchify');
var mergeStream  = require('merge-stream');
var gulp         = require('gulp');
var source       = require('vinyl-source-stream');
var config       = require('../config').browserify;
var _            = require('lodash');
var gutil        = require('gulp-util');

var browserifyTask = function(devMode) {

  var browserifyThis = function(bundleConfig) {

    if(devMode) {
      // Add watchify args and debug (sourcemaps) option
      _.extend(bundleConfig, { debug: true });
    }

    var bundler = browserify(bundleConfig);

    var runBundle = function() {
      return bundler.bundle()
        // Report compile errors
        .on("error", function(err) {
          gutil.log("Browserify error:", err);
          this.emit('end');
        })
        .pipe(source(bundleConfig.outputName))
        .pipe(gulp.dest(bundleConfig.dest))
        .pipe(browserSync.reload({stream: true}))
    };

    if(devMode) {
      bundler = watchify(bundler);
      bundler.on('update', runBundle);
    } else {
      // bundler.plugin('minifyify', {map: false, uglify: true});

      // Sort out shared dependencies.
      // b.require exposes modules externally
      // if(bundleConfig.require) bundler.require(bundleConfig.require);
      // b.external excludes modules from the bundle, and expects
      // they'll be available externally
      // if(bundleConfig.external) bundler.external(bundleConfig.external);
    }

    return runBundle();
  };

  // Start bundling with Browserify for each bundleConfig specified
  return mergeStream.apply(gulp, _.map(config.bundleConfigs, browserifyThis));
};

// Exporting the task so we can call it directly in our watch task, with the 'devMode' option
module.exports = browserifyTask;