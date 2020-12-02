const { src, dest, series, parallel } = require('gulp');

function htmlTask() {
  return src('src/*.html')
        .pipe(dest('dist'));
}

function scriptsTask() {
  return src('src/*.js')
        .pipe(dest('dist'));
}

function stylesTask() {
  return src('src/*.css')
        .pipe(dest('dist'));
}

function imagesTask() {
  return src('src/*.png')
        .pipe(dest('dist'));
}

exports.html = htmlTask;
exports.scripts = scriptsTask;
exports.styles = stylesTask;
exports.images = imagesTask;

exports.default = series(htmlTask, scriptsTask, stylesTask, imagesTask);