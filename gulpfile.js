'use strict';

const gulp        = require('gulp');
const pug         = require('gulp-pug');
const sass        = require('gulp-sass')(require('sass'));
const watch       = require('gulp-watch');
const plumber     = require('gulp-plumber');
const browserSync = require('browser-sync').create();
const rename      = require('gulp-rename');
const changed     = require('gulp-changed');
const imagemin    = require('gulp-imagemin');

gulp.task('watch', () => {
  gulp.watch('src/**/*.pug', gulp.series('pug'));
  gulp.watch('src/**/*.scss', gulp.series('styles'));
  // watch('src/**/*.pug', function() {
  //   gulp.start( 'pug' );
  // });
});

gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: './www',
      index: 'html/index.html'
    },
    port: 1234
  })

  gulp.watch('src/**/*.pug', gulp.series('pug'));
  gulp.watch('src/**/*.scss', gulp.series('styles'));
  gulp.watch('src/**/*.js', gulp.series('script'));
  gulp.watch('src/images/*', gulp.series('images'));
})

gulp.task('pug', (done) => {
  gulp
    .src('src/**/[^_]*.pug')
    .pipe(plumber())
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(rename({dirname: ''}))
    .pipe(gulp.dest('./www/html'))
    .pipe(browserSync.reload( {stream: true} ))
  done();
});

gulp.task('styles', (done) => {
  gulp
    .src('src/**/[^_]*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(rename({dirname: ''}))
    .pipe(gulp.dest('./www/css'))
    .pipe(browserSync.reload( {stream: true} ))
  done();
});

gulp.task('script', (done) => {
  gulp
    .src('src/**/[^_]*.js')
    .pipe(plumber())
    .pipe(rename({dirname: ''}))
    .pipe(gulp.dest('./www/js'))
    .pipe(browserSync.reload( {stream: true} ))
  done();
});

gulp.task('images', (done) => {
  gulp
    .src('src/images/*')
    .pipe(plumber())
    .pipe(changed('./www/images'))
    .pipe(rename({dirname: ''}))
    .pipe(imagemin())
    .pipe(gulp.dest('./www/images'))
    .pipe(browserSync.reload( {stream: true} ))
  done();
})

gulp.task('default', gulp.series('pug', 'styles', 'script', 'images', 'browserSync'));
