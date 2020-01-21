var gulp = require('gulp');
var concat = require('gulp-concat');
var minify = require('gulp-minify');

gulp.task('default', async function () {
    gulp.src('src/js/*.js')
        .pipe(concat('jquery.select-flexible.js'))
        .pipe(gulp.dest('dist'));

    gulp.src('src/css/*.css')
        .pipe(gulp.dest('dist'));
});

gulp.task('minify', async function () {
    return gulp.src('dist/jquery.select-flexible.js', { allowEmpty: true })
        .pipe(minify({noSource: true}))
        .pipe(gulp.dest('dist'))
});