var gulp = require('gulp'),
    gulpDoxx = require('gulp-doxx');
 
gulp.task('docs', function() {
 
  gulp.src(['*.js', 'README.md', 'docs/scripts/doxx_sample/*'])
    .pipe(gulpDoxx({
      title: 'dLite',
      template: 'docs/doxx_template/dLiteDoxx.jade'
    }))
    .pipe(gulp.dest('docs/doxx_docs'));
 
});