// Imports
var gulp = require('gulp');
var clean = require('gulp-clean');
var ts = require('gulp-typescript');


// Compile typescript files
gulp.task('ts', ['clean'], function () {
    return gulp
        .src(["./src/**/*.ts"], { base: './src' })
        .pipe(ts({ module: 'commonjs', noImplicitAny: false, target: 'es6', allowUnreachableCode: true, declaration: true }))
        .pipe(gulp.dest('./src'));
});

// Removes compiled js files
gulp.task('clean', function () {
    return gulp
        .src([
            './src/**/*.js',
            './src/**/*.d.ts',
            './dist'
        ], { read: false })
        .pipe(clean())
});


// Compile typescript files
gulp.task('build', ['clean'], function () {
    return gulp
        .src(["./src/**/*.ts"], { base: './src' })
        .pipe(ts({ module: 'commonjs', noImplicitAny: false, target: 'es6', declaration: true, allowUnreachableCode: true }))
        .pipe(gulp.dest('./dist'));
});