var gulp = require("gulp");
var babel = require("gulp-babel");
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
 

var version = "0.1.4";

gulp.task("babel", function () {
    return gulp.src("src/js/*.js")
        .pipe(babel())
        .pipe(gulp.dest("lib/"));
});
gulp.task("babel2", ["babel"], function () {
    return gulp.src("src/js/misc/*.js")
        .pipe(babel())
        .pipe(gulp.dest("lib/misc/"));
});

gulp.task("babel3",["babel2"], function () {
    return gulp.src("src/js/misc/*.js")
        .pipe(babel())
        .pipe(gulp.dest("dist/js/mics/"));
});

gulp.task('uglify', ["babel3"], function(){
    return gulp.src("lib/*.js")
        .pipe(uglify({preserveComments: 'some'}))
        .pipe(gulp.dest("tmp/"))
    ;
});

gulp.task('concat', ['babel', 'babel2', 'babel3', 'uglify'], function(){
    gulp.src('tmp/*.js')
        .pipe(concat('swipe-' + version + '.min.js'))
        .pipe(gulp.dest('dist/js/')) ;
    gulp.src('lib/*.js')
        .pipe(concat('swipe-' + version +'.js'))
        .pipe(gulp.dest('dist/js/')) ;
    gulp.src('tmp/*.js')
        .pipe(concat('swipe.min.js'))
        .pipe(gulp.dest('dist/js/')) ;
    gulp.src('lib/*.js')
        .pipe(concat('swipe.js'))
        .pipe(gulp.dest('dist/js/')) ;
});

gulp.task('watch', function() {
    gulp.watch(['src/js/*.js', 'src/js/misc/*.js'], ['babel', 'babel2', 'babel3', 'uglify', 'concat'])
});


gulp.task('default', function(cb) {
    return runSequence(['babel', 'babel2', 'babel3', 'uglify', 'concat'], cb);
});
