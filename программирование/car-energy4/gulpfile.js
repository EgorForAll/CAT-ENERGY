const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const fileinclude = require ("gulp-file-include");
const del = require("del");
const terser = require("gulp-terser");
const svgstore = require("gulp-svgstore");
const csso = require("postcss-csso");
const webp = require("gulp-webp");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const sync = require("browser-sync"). create();

// Styles

const styles = () => {
  return gulp.src("src/scss/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// HTML

const html = () => {
  return gulp.src("src/*.html")
    .pipe(fileinclude())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"))
    .pipe(sync.stream());
}

// Images

const copyImages = () => {
  return gulp.src("src/files/img/**/*.{png,jpg,svg}")
    .pipe(gulp.dest("build/files/img"))
}

exports.images = copyImages;

// WebP

const createWebp = () => {
  return gulp.src("src/files/img/**/*.{jpg,png}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/files/img"))
}

exports.createWebp = createWebp;

// Sprite

const sprite = () => {
  return gulp.src("src/files/img/footer_svg/*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/files/img/footer_svg"));
}

exports.sprite = sprite;

// Copy

const copy = (done) => {
  gulp.src([
    "src/files/fonts/*.{woff2,woff}",
    "src/*.ico",
    "src/html/*.*",
    "src/manifest.webmanifest",
  ], {
    base: "src"
  })
    .pipe(gulp.dest("build"))
  done();
}

// Scripts

const scripts = () => {
  return gulp.src("src/files/scripts/scripts.js")
    .pipe(terser())
    .pipe(rename("script.min.js"))
    .pipe(gulp.dest("build/files/scripts"))
    .pipe(sync.stream());
}

exports.scripts = scripts;

// Clean

const clean = () => {
  return del("build");
};

// Reload

const reload = (done) => {
  sync.reload();
  done();
}

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "build"
    },
    browser: "chrome",
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

//  Watcher

// Default

exports.default = gulp.series(clean, copy, copyImages, gulp.parallel(html, styles, scripts, sprite, createWebp), server);

