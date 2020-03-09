// Plugins
const gulp = require("gulp");
const ejs = require("gulp-ejs");
const rename = require("gulp-rename");
const connect = require("gulp-connect");
const open = require("gulp-open");
const imagemin = require("gulp-imagemin");
const sass = require("gulp-sass");
sass.compiler = require("node-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const pxtorem = require("postcss-pxtorem");

// Pathing
const path = { in: "src", out: "dist" };
const htmlPath = {
  watch: `${path.in}/html/**/*.ejs`,
  out: `${path.out}`,
  in: `${path.in}/html/templates/*.ejs`
};
const scssPath = {
  in: `${path.in}/scss/**/*.scss`,
  out: `${path.out}/assets/styles`
};
const scriptsPath = {
  in: `${path.in}/scripts/**/*.js`,
  out: `${path.out}/assets/scripts`
};
const imagesPath = {
  in: `${path.in}/images/**/*`,
  out: `${path.out}/assets/media`
};

// Port
const port = 8080;

function html() {
  return gulp
    .src(htmlPath.in)
    .pipe(ejs())
    .pipe(
      rename(function(path) {
        if (path.basename != "index") {
          path.dirname = path.basename;
          path.basename = "index";
        }
        path.extname = ".html";
      })
    )
    .pipe(gulp.dest(htmlPath.out))
    .pipe(connect.reload());
}

function scss() {
  const postcssPlugins = [autoprefixer(), pxtorem()];

  return gulp
    .src(scssPath.in)
    .pipe(sass())
    .pipe(postcss(postcssPlugins))
    .pipe(gulp.dest(scssPath.out))
    .pipe(connect.reload());
}

function js() {
  return gulp
    .src(scriptsPath.in)
    .pipe(gulp.dest(scriptsPath.out))
    .pipe(connect.reload());
}

function images() {
  return gulp
    .src(imagesPath.in)
    .pipe(imagemin())
    .pipe(gulp.dest(imagesPath.out))
    .pipe(connect.reload());
}

function connectServer(done) {
  connect.server({
    livereload: true,
    root: path.out,
    port: port
  });

  done();
}

function openInBrowser() {
  return gulp
    .src(`${path.out}/index.html`, {
      allowEmpty: true
    })
    .pipe(
      open({
        uri: `http://localhost:${port}`
      })
    );
}

function watchAll(cb) {
  gulp.watch(
    [htmlPath.in],
    {
      ignoreInitial: false
    },
    html
  );

  gulp.watch(
    [scssPath.in],
    {
      ignoreInitial: false
    },
    scss
  );

  gulp.watch(
    [scriptsPath.in],
    {
      ignoreInitial: false
    },
    js
  );

  gulp.watch(
    [imagesPath.in],
    {
      ignoreInitial: false
    },
    images
  );

  cb();
}

exports.dev = gulp.series(watchAll, connectServer, openInBrowser);
exports.build = gulp.parallel(html, scss, js, images);
