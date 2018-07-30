var gulp = require('gulp');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnext = require('cssnext');
var precss = require('precss');


gulp.task('css', function () {
  var processors = [
    autoprefixer,
    cssnext,
    precss,
    
  ];
  return gulp.src('./src/Styles/src/*.css')
    .pipe(postcss(processors))
    .on('error', swallowError)
    .pipe(gulp.dest('./src/Styles/dist'));
});

gulp.task('watch', function () {
  gulp.watch('./src/Styles/src/*.css',{cwd:'./'}, ['css'])
})

gulp.task('default',['css','watch']);






function swallowError (error) {

  // If you want details of the error in the console
  console.log(error.toString())

  this.emit('end')
}
