/**
 * Created by michaeldfti on 14/01/17.
 */

var gulp                    = require('gulp');
var livereload              = require("gulp-livereload");
var sass                    = require("gulp-sass");
var sourcemaps              = require("gulp-sourcemaps");
var uglify                  = require("gulp-uglify");
var concat                  = require("gulp-concat");
var plumber                 = require("gulp-plumber");
var imagemin                = require('gulp-imagemin');
var imageminPngquant        = require('imagemin-pngquant');
var imageminJpegRecompress  = require('imagemin-jpeg-recompress');
var compass                 = require('gulp-compass');
var nunjucks                = require('gulp-nunjucks-html');


//Filespaths
var DIST_PATH       = 'public/dist';
var SCRIPTS_PATH    = 'public/scripts/**/*.js';
var SCSS_PATH       = 'public/scss/**/*.scss';
var IMAGES_PATH     = 'public/images/**/*.{png,jpeg,jpg,svg,gif}';
var TEMPLATES_PATH  = 'public/templates';
//Styles For SCSS
gulp.task("styles", function(){
    console.log("starting styles task");
    return gulp.src([SCSS_PATH])
        .pipe(plumber(function (err) {
            console.log("Styles task Error");
            console.log(err);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(concat('styles.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIST_PATH + '/css'))
        .pipe(livereload());
});

//Scripts
gulp.task("scripts", function(){
    console.log("starting scripts task");
    return gulp.src(['bower_components/jquery/dist/jquery.min.js',SCRIPTS_PATH])
        .pipe(plumber(function (err) {
            console.log("Scripts task Error");
            console.log(err);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIST_PATH + '/scripts'))
        .pipe(livereload());
});

//Images
gulp.task("images", function(){
    console.log("starting images task");
    return gulp.src(IMAGES_PATH)
        .pipe(imagemin(
            [
                imagemin.gifsicle(),
                imagemin.jpegtran(),
                imagemin.optipng(),
                imagemin.svgo(),
                imageminPngquant(),
                imageminJpegRecompress()
            ]
        ))
        .pipe(gulp.dest(DIST_PATH + '/images'))
        .pipe(livereload());
});

//Nunjucks
gulp.task('nunjucks', function() {
    console.log("starting nunjucks task");
    return gulp.src([TEMPLATES_PATH+"/index/*.html"])
        .pipe(nunjucks({
            searchPaths: [
                'public/templates/index',
                'public/templates/index/partials',
                'public/templates/index/partials/main']
        }))
        .pipe(gulp.dest('public/'))
        .pipe(livereload());
});

//Default
gulp.task('default', ['images', 'styles', 'scripts', 'nunjucks'], function () {
    console.log("starting default task");
});


gulp.task('watch', ['default'], function () {
    console.log("starting watch task");
    require("./server.js");
    livereload.listen();
    gulp.watch(IMAGES_PATH, ['images']);
    gulp.watch(SCRIPTS_PATH, ['scripts']);
    gulp.watch(SCSS_PATH, ['styles']);

});