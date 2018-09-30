var gulp = require("gulp");
var babel = require("gulp-babel");
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');

const webpackStream = require("webpack-stream");
const webpack = require("webpack");

var mocha = require('gulp-mocha');
var gutil = require('gulp-util');

const webpackConfig = require("./webpack.config.js");
const webpackDevConfig = require("./webpack.dev.config.js");

var version = "2.0.0";

gulp.task("babel", function () {
  return gulp.src("src/js/*.js")
    .pipe(babel())
    .pipe(gulp.dest("lib/"));
});
gulp.task("babel2", function () {
    return gulp.src("src/js/misc/*.js")
        .pipe(babel())
        .pipe(gulp.dest("lib/misc/"));
});

gulp.task("babel3", function () {
    return gulp.src("src/js/misc/*.js")
        .pipe(babel())
        .pipe(gulp.dest("dist/js/mics/"));
});

gulp.task("babeltest", function () {
    return gulp.src("src/test/*.js")
        .pipe(babel())
        .pipe(gulp.dest("test/"));
});

gulp.task('uglify', function(){
    return gulp.src("lib/*.js")
        .pipe(uglify({preserveComments: 'some'}))
        .pipe(gulp.dest("tmp/"))
    ;
});

// lib/*.js -> dist/js/swipe-new-*.js
gulp.task('webpack', function(cb) {
  return webpackStream(webpackConfig, webpack)
    .pipe(gulp.dest("tmp/webpack"));
});

gulp.task('webpackdev', function(cb) {
  return webpackStream(webpackDevConfig, webpack)
    .pipe(gulp.dest("tmp/webpackdev"));
});

gulp.task('concat', function(){
  gulp.src('tmp/webpackdev/*.js')
    .pipe(concat('swipe.js'))
    .pipe(gulp.dest('dist/js/')) ;
  gulp.src('tmp/webpack/*.js')
    .pipe(concat('swipe.min.js'))
    .pipe(gulp.dest('dist/js/')) ;

  gulp.src('tmp/webpackdev/*.js')
    .pipe(concat('swipe-' + version + '.js'))
    .pipe(gulp.dest('dist/js/')) ;
  gulp.src('tmp/webpack/*.js')
    .pipe(concat('swipe-' + version + '.min.js'))
    .pipe(gulp.dest('dist/js/')) ;
  
/*  
  gulp.src('tmp/*.js')
    .pipe(concat('swipe-' + version + '.min.js'))
    .pipe(gulp.dest('dist/js/')) ;
  gulp.src('tmp/*.js')
    .pipe(concat('swipe.min.js'))
    .pipe(gulp.dest('dist/js/')) ;
  gulp.src('lib/*.js')
    .pipe(concat('swipe-' + version +'.js'))
    .pipe(gulp.dest('dist/js/')) ;
  gulp.src('lib/*.js')
    .pipe(concat('swipe.js'))
    .pipe(gulp.dest('dist/js/')) ;
*/
  
});


gulp.task('mocha', function() {
  return gulp.src(['test/*.js'], { read: false })
    .pipe(mocha({ reporter: 'list'}))
    .on('error', gutil.log);
});

gulp.task('test', function() {
  gulp.watch(['src/test/*.js'], ['run-test']);
});
gulp.task('run-test', function(cb) {
  runSequence('babel', 'babeltest', 'mocha', cb);
});

gulp.task('watch', function() {
  gulp.watch(['src/js/*.js', 'src/js/misc/*.js', 'src/test/*.js'], ['default'])
});

gulp.task('default', function(cb) {
  return runSequence('babel', 'babel2', 'babel3', 'babeltest', 'mocha', 'uglify', 'webpack', 'webpackdev', 'concat', cb);
});
