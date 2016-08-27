var gulp = require("gulp");
var babel = require("gulp-babel");
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
 

var version = "0.0.1";

gulp.task("babel", function () {
    gulp.src("src/js/*.js")
        .pipe(babel())
        .pipe(gulp.dest("lib/"));
    gulp.src("src/js/misc/*.js")
        .pipe(babel())
        .pipe(gulp.dest("lib/misc/"));
});

gulp.task('watch', function() {
    gulp.watch('src/js/*.js', ['babel', 'uglify', 'concat'])
});

gulp.task('uglify', function(){
    gulp.src("lib/*.js")
        .pipe(uglify({preserveComments: 'some'}))
        .pipe(gulp.dest("tmp/"))
    ;
});

gulp.task('concat', function(){
    gulp.src('tmp/*.js')
        .pipe(concat('swipe-' + version + '.min.js'))
        .pipe(gulp.dest('publish/')) ;
    gulp.src('lib/*.js')
        .pipe(concat('swipe-' + version +'.js'))
        .pipe(gulp.dest('publish/')) ;
    gulp.src('tmp/*.js')
        .pipe(concat('swipe.min.js'))
        .pipe(gulp.dest('publish/')) ;
    gulp.src('lib/*.js')
        .pipe(concat('swipe.js'))
        .pipe(gulp.dest('publish/')) ;
});

gulp.task('default', ['babel', 'watch', 'uglify', 'concat']);
