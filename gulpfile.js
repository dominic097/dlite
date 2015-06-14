var gulp = require('gulp'),
    gulpDoxx = require('gulp-doxx');
 
gulp.task('docs', function() {
 
  gulp.src(['dLite.js', 'README.md', 'docs/scripts/doxx_sample/*'])
    .pipe(gulpDoxx({
      title: 'dLite',
      template: 'docs/doxx_template/dLiteDoxx.jade'
    }))
    .pipe(gulp.dest('docs/doxx_docs'));

gulp.src('./scripts/doxx_sample/*.html', { base: './' }).pipe(gulp.dest('./doxx_docs'));
 
});