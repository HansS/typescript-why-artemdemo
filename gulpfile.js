var gulp = require('gulp');
var typescript = require('gulp-typescript');

gulp.task('default', function () {
    return gulp.src('source/**/*.ts')
            .pipe(typescript({
                module: 'amd' // support: 'commonjs', 'amd', 'umd' or 'system'
            }))
            .pipe(gulp.dest('dist'));
});