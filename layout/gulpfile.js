const gulp = require('gulp'),
    del = require('del'),
    header = require('gulp-header'),
    sass = require('gulp-sass')(require('sass')),
    plumber = require('gulp-plumber'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    browserSync = require('browser-sync').create(),
    csso = require("gulp-csso"),
    rename = require('gulp-rename'),
    htmlmin = require('gulp-htmlmin'),
    posthtml = require('gulp-posthtml');

// Local server (gulp watch)

gulp.task('style', function () {
    return gulp.src('src/scss/style.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest('build/css'));
});

gulp.task('watch', function () {
    browserSync.init({
        server: 'build/'
    });
    gulp.watch('src/scss/**/*.scss', gulp.series('minify-css'));
    gulp.watch('src/pages/*.html', gulp.series('minify-html'));
});


// Minify CSS/HTML/JS

gulp.task('minify-css', function () {
    return gulp.src('src/scss/style.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(browserSync.stream())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(gulp.dest('build/css'))
        .pipe(csso())
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('build/css'));
});

gulp.task('minify-html', function () {
    return gulp.src('src/**/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('build'));
});

// Build

gulp.task('copy', function () {
    return gulp.src([
        'src/**/fonts/**/*.{woff,woff2}',
        'src/**/img/**/*.{png,jpg,gif,svg,webp}',
        'src/js/**'
    ], {
        base: 'src'
    })
        .pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
    return del('./build');
});

gulp.task('build', gulp.series(
    'clean',
    'copy',
    'style',
    'minify-html',
    'minify-css',
));
