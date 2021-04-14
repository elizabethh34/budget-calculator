const { src, dest, series, parallel } = require('gulp');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');

function htmlTask() {
  return src('src/*.html')
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

function scriptsTask() {
  return src('src/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(concat('main.js'))
    .pipe(dest('dist'))
}

function imagestask() {
  return src('src/*.png')
    .pipe(imagemin())
    .pipe(dest('dist'))
}

exports.html = htmlTask;
exports.styles = stylesTask;
exports.scripts = scriptsTask;
exports.images = imagestask;
exports.default = parallel(htmlTask, stylesTask, scriptsTask, imagestask);