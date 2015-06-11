var gulp = require('gulp'),
    gulpDoxx = require('gulp-doxx');
 
gulp.task('docs', function() {
 
  gulp.src(['*.js', 'README.md'])
    .pipe(gulpDoxx({
      title: 'dLite',
      urlPrefix: './doxx_docs'
    }))
    .pipe(gulp.dest('./doxx_docs'));
 
});