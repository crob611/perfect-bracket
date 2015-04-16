var gulp = require('gulp');
var shell = require('gulp-shell');
require('harmonize')();

gulp.task('default', ['build', 'serve', 'watch']);
gulp.task('lint', ['jshint', 'jscs']);

gulp.task('jshint', function() {
  var jshint = require('gulp-jshint');
  var stylish = require('jshint-stylish');

  gulp.src(['./src/**/*.js', './src/**/*.jsx'])
    .pipe(jshint({ linter: require('jshint-jsx').JSXHINT }))
    .pipe(jshint.reporter('default', { verbose: true }));
});

gulp.task('jscs', function() {
  var jscs = require('gulp-jscs');

  gulp.src(['./src/**/*.js', './src/**/*.jsx'])
    .pipe(jscs())
    .on('error', function (err) { console.log("Error: " + err.message); });
});

/*gulp.task('test', function(done) {
  var jest = require('jest-cli');
  var p = require('./package.json');
  jest.runCLI({ config : p.jest }, ".", function() {
      done();
  });
});*/

gulp.task('test', shell.task('npm test', {
  // So our task doesn't error out when a test fails
  ignoreErrors: true
}));

gulp.task('build', function() {
  var fs = require("fs");
  var browserify = require("browserify");
  var babelify = require("babelify");
  var exorcist = require("exorcist");

  browserify({ debug: true, extensions: ['.js', '.jsx']})
    .transform(babelify)
    .require("./src/app.jsx", { entry: true })
    .bundle()
    .on("error", function (err) { console.log("Error: " + err.message); })
    .pipe(exorcist("build/app.js.map"))
    .pipe(fs.createWriteStream("build/app.js"));

  gulp.src('./src/index.html')
    // Perform minification tasks, etc here
    .pipe(gulp.dest('./build/'));
});

gulp.task('serve', function() {
  var connect = require('gulp-connect');
  connect.server({
    root: './build',
    livereload: true
  });
});

gulp.task('watch', function() {
  gulp.watch(['src/**/*'], ['build', 'lint', 'test']);
})
