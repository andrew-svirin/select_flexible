var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('default', async function () {
    gulp.src('src/js/*.js')
        .pipe(concat('jquery.select-flexible.js'))
        .pipe(gulp.dest('dist'));

    gulp.src('src/css/*.css')
        .pipe(gulp.dest('dist'));
});