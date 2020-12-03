const { src, dest, series, parallel } = require('gulp');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps'); 
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');

function htmlTask() {
  return src('src/*.html')
    .pipe(dest('dist'))
}

function scriptsTask() {
  return src('src/*.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(concat('main.js'))
    .pipe(dest('dist'))
}

function stylesTask() {
  return src('src/*.css')
    .pipe(sourcemaps.init())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write())
    .pipe(concat('style.css'))
    .pipe(dest('dist'))
}

function imagesTask() {
  return src('src/*.png')
    .pipe(imagemin())
    .pipe(dest('dist'))
}

exports.html = htmlTask;
exports.scripts = scriptsTask;
exports.styles = stylesTask;
exports.images = imagesTask;

exports.default = series(htmlTask, scriptsTask, stylesTask, imagesTask);