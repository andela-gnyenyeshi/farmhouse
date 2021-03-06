(function() {
  'use strict';

  let gulp = require('gulp'),
    jade = require('gulp-jade'),
    less = require('gulp-less'),
    reactify = require('reactify'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    lint = require('gulp-eslint'),
    gutil = require('gulp-util'),
    imagemin = require('gulp-imagemin'),
    nodemon = require('gulp-nodemon'),
    source = require('vinyl-source-stream'),
    path = require('path');

  let paths = {
    public: 'public',
    images: 'app/images/**',
    scripts: 'app/scripts/**/*.+(js|jsx)',
    less: 'app/styles/*.+(less|css)',
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


  gulp.task('images', function() {
    gulp.src(paths.images)
      .pipe(imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true
      }))
      .pipe(gulp.dest('./public/images/'));
  });


  gulp.task('browserify', function () {
    // app.js is your main JS file with all your module inclusions
    return browserify({entries: './app/scripts/app.jsx', debug: true})
        .transform("babelify", { presets: ["es2015", "react"] })
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./public/js'));
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
  gulp.task('build', ['jade', 'less', 'font', 'images', 'browserify']);
})();
