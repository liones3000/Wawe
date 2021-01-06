const { task, src, dest, watch, parallel } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const spritesmith = require('gulp.spritesmith');
const concat = require('gulp-concat');
const merge = require('merge-stream');
// const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();

sass.compiler = require('node-sass');

function browsersync() {
  browserSync.init({
    server: {
      baseDir: 'dist/',
    },
    notify: false,
  });
}

function js() {
  return src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/mixitup/dist/mixitup.js',
    'node_modules/slick-slider/slick/slick.min.js',
    'src/assets/js/jquery.fancybox.min.js',
    'src/assets/js/main.js',
  ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('dist/js/'));
}

function scss() {
  return src('src/scss/style.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream());
}

function imgMin() {
  return src('src/assets/images/**/*.*')
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest('dist/images'));
}

function generateSprite() {
  const spriteData = src('src/assets/sprite/*.*').pipe(
    spritesmith({
      imgName: 'sprite.png',
      cssName: '_sprite.scss',
      imgPath: '../images/sprite.png',
      padding: 5,
    })
  );

  const imgStream = spriteData.img.pipe(dest('src/assets/images'));

  const cssStream = spriteData.css.pipe(dest('src/scss/mixins'));

  return merge(imgStream, cssStream);
}

function watching() {
  scss();
  // imgMin();
  // generateSprite();
  js();

  watch(['src/assets/sprite/*.*'], generateSprite);
  watch(['src/assets/images/**/*.*'], imgMin);
  watch(['src/scss/**/*.scss'], scss);
  watch(['src/assets/js/**/*.js'], js);
  watch(['dist/**/*.html']).on('change', browserSync.reload);
}

exports.scss = scss;
exports.js = js;
exports.browsersync = browsersync;
exports.watching = watching;

exports.default = parallel(scss, js, browsersync, watching);
