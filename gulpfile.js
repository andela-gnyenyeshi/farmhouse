(function() {
  'use strict';

  var gulp = require('gulp'),
    jade = require('gulp-jade'),
    less = require('gulp-less'),
    reactify = require('reactify'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    lint = require('gulp-eslint'),
    gutil = require('gulp-util'),
    nodemon = require('gulp-nodemon'),
    source = require('vinyl-source-stream'),
    path = require('path');

  var paths = {
    public: 'public',
    images: 'app/images/**',
    scripts: 'app/scripts/**/*.+(js|jsx)',
    less: 'app/style/*.+(less|css)',
    jade: 'app/**/*.jade'
  };

  gulp.task('lint', function() {
    return gulp.src(['app/**/*.+(js|jsx)', 'server/**/*.js'])
    .pipe(lint())
      .pipe(lint.format());
  });

  gulp.task('jade', function() {
    gulp.src(paths.jade)
      .pipe(jade())
      .pipe(gulp.dest('./public/'));
  });

  gulp.task('less', function() {
    gulp.src(paths.less)
      .pipe(less({
        paths: [path.join(__dirname, './app/styles')]
      }))
      .pipe(gulp.dest('./public/css'));
  });

  gulp.task('font', function() {
    gulp.src('./app/fonts/*.{ttf,woff,eof,svg}')
      .pipe(gulp.dest('./public/fonts'));
  });

  gulp.task('browserify', function() {
    var bundler = browserify({
      entries: ['./app/scripts/app.jsx'],
      debug: true,
      fullPaths: true,
      transform: [reactify, babelify]
    });

    bundler.bundle()
      .on('success', gutil.log.bind(gutil, 'Browserify Rebundled'))
      .on('error', gutil.log.bind(gutil, 'Browserify ' +
        'Error: in browserify gulp task'))
      // vinyl-source-stream makes the bundle compatible with gulp
      .pipe(source('app.js')) // filename
      // Output the file
      .pipe(gulp.dest('./public/js/'));
    return bundler;
  });

  gulp.task('server', function() {
    nodemon({
        script: 'app.js',
        ext: 'js',
        // tasks: ['lint'],
        ignore: ['public/', 'node_modules/']
      })
      .on('restart', function() {
        console.log('>> node restart');
      });
  });

  gulp.task('watch', function() {
    gulp.watch(paths.jade, ['jade']);
    gulp.watch(paths.styles, ['less']);
    gulp.watch(paths.scripts, ['browserify']);
  });

  gulp.task('default', ['server', 'watch', 'build']);
  gulp.task('build', ['jade', 'less', 'font', 'browserify']);
})();
