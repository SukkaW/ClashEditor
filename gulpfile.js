const gulp = require('gulp');

const ejs = require('gulp-ejs');
const htmlmin = require('gulp-htmlmin');
const log = require('fancy-log')
const ejsConfig = require('./src/config.js')
const rename = require('gulp-rename')

const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');

const targetBrowser = [
    'last 2 versions',
    'since 2016',
    '> 1%',
    'Chrome >= 40',
    'Firefox >= 40',
    'ie >= 11',
    'Safari >= 10',
]

const buildHTML = () => gulp.src('src/templates/*.ejs')
    .pipe(ejs(ejsConfig).on('error', log))
    .pipe(htmlmin({
        "removeComments": true,
        "collapseWhitespace": true,
        "collapseBooleanAttributes": true,
        "removeEmptyAttributes": true,
        "removeScriptTypeAttributes": true,
        "removeStyleLinkTypeAttributes": true,
        "minifyJS": true,
        "minifyCSS": true,
        "sortAttributes": true,
        "sortClassName": true,
        "processScripts": [
            "application/ld+json"
        ],
        "removeAttributeQuotes": true
    }))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest('dist'))

const devHTML = () => gulp.src('src/templates/*.ejs')
    .pipe(ejs(ejsConfig).on('error', log))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest('dist'))

const buildJS = () => gulp.src('src/js/*.js')
    .pipe(babel({
        "presets": [
            ["@babel/env", {
                "targets": targetBrowser
            }]
        ]
    }))
    .pipe(uglify({
        output: {
            comments: /^!/
        }
    }))
    .pipe(gulp.dest('dist/js'));

const devJS = () => gulp.src('src/js/*.js')
    .pipe(gulp.dest('dist/js'));

const buildCSS = () => gulp.src('src/css/*.css')
    .pipe(autoprefixer({ overrideBrowserslist: targetBrowser }))
    .pipe(cleancss())
    .pipe(gulp.dest('dist/css'));

const devCSS = () => gulp.src('src/css/*.css')
    .pipe(gulp.dest('dist/css'));

gulp.task('build', gulp.parallel(
    buildJS,
    buildCSS,
    buildHTML
));

gulp.task('dev', gulp.parallel(
    devJS,
    devCSS,
    devHTML
));

gulp.task('watch', () => {
    gulp.watch('src/**', gulp.series('dev'))
});

gulp.task('default', gulp.series('build'));
