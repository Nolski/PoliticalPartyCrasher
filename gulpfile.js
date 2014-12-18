'use strict';

var gulp        = require('gulp'),
    ngmin       = require('gulp-ngmin'),
    sourcemaps  = require('gulp-sourcemaps'),
    uglify      = require('gulp-uglify'),
    concat      = require('gulp-concat');

var paths = {
    js: 'client/*.js'
};

gulp.task('compile-js', function () {
    gulp
        .src([
            'bower_components/momentjs/min/moment.min.js',
            'bower_components/d3/d3.min.js',
            'bower_components/url/url.min.js',
            'bower_components/angular/angular.min.js',
            'bower_components/leaflet/dist/leaflet.js',
            'bower_components/leaflet-sidebar/src/L.Control.Sidebar.js',
            'bower_components/leaflet-omnivore/leaflet-omnivore.min.js',
            'client/app.js',
            'client/services.js',
            'client/controllers.js',
            'client/directives.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('scripts.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('static/js/'));
});

gulp.task('watch', function() {
    gulp.watch(paths.js, ['compile-js']);
});

gulp.task('default', ['compile-js', 'watch'], function() {});
