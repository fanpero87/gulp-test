'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();

// Location of the soruce and destination files

var paths = {
    css: {
        src: './src/scss/*.scss',
        dest: 'dist/css'
    },
    js: {
        src: './src/js/*.js',
        dest: 'dist/js'
    },
    html: {
        src: './src/*.html',
        dest: 'dist'
    },
    img: {
        src: './src/img/*{.png,.jpg,.svg}',
        dest: 'dist/img'
    }
}

// Functions that will do the process when called

function styles()
{
    return gulp
        .src(paths.css.src)                             // grab the file from the source
        .pipe(sourcemaps.init())                        //
        .pipe(sass())                                   // compile scss
        .on('error', sass.logError)                     // validate error on the code
        .pipe(postcss([autoprefixer(), cssnano()]))      // cssnano will minify the code
        .pipe(sourcemaps.write())                       // white into 
        .pipe(gulp.dest(paths.css.dest))                // copy the result on the destination folder
        .pipe(browserSync.stream());                    // allow the browser to reload the site after each change
}

function scripts()
{
    return gulp
        .src(paths.js.src)                              // passing the source file
        .pipe(gulp.dest(paths.js.dest))                 // compile and send to destination folder
        .pipe(browserSync.stream());                    // reload the browser after each change
}

function html()
{
    return gulp
        .src(paths.html.src)
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSync.stream());
}

function images()
{
    return gulp
        .src(paths.img.src)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.img.dest))
        .pipe(browserSync.stream());
}

function watch()
{
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    });

    gulp.watch(paths.css.src, styles);
    gulp.watch(paths.js.src, scripts);
    gulp.watch(paths.html.src, html).on('change', browserSync.reload);
    gulp.watch(paths.img.src, images);
}

exports.watch = watch;

var build = gulp.parallel(styles, scripts, html, images, watch);

// Creates default task
gulp.task('default', build);