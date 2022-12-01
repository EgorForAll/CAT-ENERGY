import dartSass from "sass";
import gulpSass from "gulp-sass";
import rename from "gulp-rename";
import sourcemaps from "gulp-sourcemaps";

import cleanCss from "gulp-clean-css"; // Сжатие CSS файла
import webpcss from "gulp-webpcss"; // Вывод WEBp изображений
import autoprefixer from "gulp-autoprefixer"; // Добавление вендорных префиксов
import groupCssMediaQueries from "gulp-group-css-media-queries"; // Группировка медиа запросов


const sass = gulpSass(dartSass);

export const scss = () => {
  return app.gulp.src(app.path.src.scss, {sourcemaps: true})
    .pipe(app.plugins.plumber(
          app.plugins.notify.onError({
            title: "SCSS",
            message: "Error: <%= error.message %>"
          })
        ))
    .pipe(app.plugins.replace(/@img\//g, '../img/'))
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(groupCssMediaQueries())
    // .pipe(webpcss({
    //   webpClass: ".webp",
    //   nowebpClass: ".no-webp"
    // }))
    .pipe(autoprefixer({
      grid:true,
      overrrideBrowsersList: ['last 3 versions'],
      cascade: true
    }))
    // Раскоментировать если нужен не сжатый дубль файла
    .pipe(app.gulp.dest(app.path.build.css))
    .pipe(cleanCss())
    .pipe(rename({
      extname: ".min.css"
    }))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(app.gulp.dest(app.path.build.css))
    .pipe(app.plugins.browsersync.stream());
}