var gulp = require('gulp'),
    gulpDoxx = require('gulp-doxx'),
    concat = require("gulp-concat"),
    clean = require('gulp-clean');
    paths = {
      sample_doxx: ['./docs/scripts/doxx_sample/*'],
      create_docs: ['README.md', 'docs/scripts/doxx_sample/dLite'],
      des_docs: 'docs/doxx_docs',
      jade_template_doxx: 'docs/doxx_template/dLiteDoxx.jade',
      move_des: 'docs/doxx_docs/',
      move_src: 'docs/doxx_docs/docs/scripts/doxx_sample/*',
      clean_src: 'docs/doxx_docs/docs'
    };

gulp.task('clean', function(){
  return gulp.src(paths.clean_src, {read:false})
  .pipe(clean());
}); 

gulp.task('move', function(){
  gulp.src(paths.move_src)
  .pipe(gulp.dest(paths.move_des));
});
    
gulp.task('concat_docs_samples', function() {
  return gulp.src(paths.sample_doxx)
    .pipe(concat('dLite'))
    .pipe(gulp.dest('./docs/scripts/doxx_sample/'));
});
 
gulp.task('docs', function() {
  gulp.src(paths.create_docs)
    .pipe(gulpDoxx({
      title: 'dLite'
    }))
    .pipe(gulp.dest(paths.des_docs));
 
});

// // Rerun the task when a file changes
// gulp.task('watch', function() {
//   gulp.watch(paths.create_docs, ['concat_docs_samples', 'docs', 'move', 'clean']);
//   gulp.watch(paths.sample_doxx, ['concat_docs_samples', 'docs', 'move', 'clean']);
// });

gulp.task('default', ['clean', 'concat_docs_samples', 'docs', 'move']);