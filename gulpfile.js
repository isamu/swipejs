var gulp = require("gulp");
var babel = require("gulp-babel");
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

const webpackStream = require("webpack-stream");
const webpack = require("webpack");

var mocha = require('gulp-mocha');
var log = require('fancy-log');

const webpackConfig = require("./webpack.config.js");
const webpackDevConfig = require("./webpack.dev.config.js");

const babel_conf = {
  presets: [
    '@babel/env',
    {
      "plugins": [
        "add-module-exports"
      ]
    }
  ]};

const version = "2.0.0";

gulp.task("babel", function () {
  return gulp.src("src/js/*.js")
    .pipe(babel(babel_conf))
    .pipe(gulp.dest("lib/"));
});
gulp.task("babel2", function () {
  return gulp.src("src/js/misc/*.js")
        .pipe(babel(babel_conf))
        .pipe(gulp.dest("lib/misc/"));
});

gulp.task("babel3", function () {
  return gulp.src("src/js/misc/*.js")
        .pipe(babel(babel_conf))
        .pipe(gulp.dest("dist/js/mics/"));
});

gulp.task("babeltest", function () {
  return gulp.src("src/test/*.js")
        .pipe(babel(babel_conf))
        .pipe(gulp.dest("test/"));
});

gulp.task('uglify', function(){
  return gulp.src("lib/*.js")
    .pipe(uglify({}))
    .pipe(gulp.dest("tmp/"));
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

gulp.task('concat1', function(){
  return gulp.src('tmp/webpackdev/*.js')
    .pipe(concat('swipe.js'))
    .pipe(gulp.dest('dist/js/'));
});
gulp.task('concat2', function(){
  return gulp.src('tmp/webpack/*.js')
    .pipe(concat('swipe.min.js'))
    .pipe(gulp.dest('dist/js/'));
});
gulp.task('concat3', function(){
  return gulp.src('tmp/webpackdev/*.js')
    .pipe(concat('swipe-' + version + '.js'))
    .pipe(gulp.dest('dist/js/')) ;
});
gulp.task('concat4', function(){
  return gulp.src('tmp/webpack/*.js')
    .pipe(concat('swipe-' + version + '.min.js'))
    .pipe(gulp.dest('dist/js/'));
});
gulp.task('concat',  gulp.series('concat1', 'concat2', 'concat3', 'concat4'));


gulp.task('mocha', function() {
  return gulp.src(['test/*.js'], { read: false })
    .pipe(mocha({ reporter: 'list'}))
    .on('error', log);
});

gulp.task('wtest', function() {
  gulp.watch(['src/test/*.js'], gulp.series('run-test'));
});
gulp.task('run-test', gulp.series('babel', 'babeltest', 'mocha'));

gulp.task('watch', function() {
  gulp.watch(['src/js/*.js', 'src/js/misc/*.js', 'src/test/*.js'], gulp.series('default'))
});

gulp.task('default', gulp.series('babel', 'babel2', 'babel3', 'babeltest', 'mocha', 'uglify', 'webpack', 'webpackdev', 'concat'));


gulp.task('build',  gulp.series('babel', 'babel2', 'babel3', 'babeltest'));

