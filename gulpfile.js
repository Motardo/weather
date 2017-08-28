'use strict';

const gulp = require('gulp');
const connect = require('gulp-connect');
const stylus = require('gulp-stylus');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const pug = require('gulp-pug');
const rename = require('gulp-rename');

gulp.task('css', () => {
  gulp.src('src/*.styl')
    .pipe(stylus({ compress: false, paths: ['src'] }))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(rename('style.css'))
    .pipe(gulp.dest('.'))
    .pipe(connect.reload());
});

gulp.task('html', () => {
  gulp.src('src/*.pug')
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest('.'))
    .pipe(connect.reload());
});

gulp.task('js', () => {
  gulp.src(['src/*.js', 'lib/*.js'])
    .pipe(gulp.dest('.'))
    .pipe(connect.reload());
});

gulp.task('watch', () => {
  gulp.watch('src/*.styl', ['css']);
  gulp.watch('src/*.pug', ['html']);
  gulp.watch('src/*.js', ['js']);
});

gulp.task('connect', () => {
  connect.server({
    root: '.',
    livereload: true,
    open: true,
  });
});

gulp.task('start', ['default', 'connect', 'watch']);

gulp.task('default', ['css', 'html', 'js']);
