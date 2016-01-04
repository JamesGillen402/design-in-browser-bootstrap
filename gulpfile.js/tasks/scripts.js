var gulp         = require('gulp');
var sourcemaps   = require("gulp-sourcemaps");
var browserSync  = require('browser-sync');
var config       = require('../config').scripts;

gulp.task('scripts', function() {
    return gulp.src(config.src)
        .pipe(babel({presets: ['es2015']}))
        .pipe(gulp.dest(config.dest))
        .pipe(browserSync.reload({stream:true}));
});