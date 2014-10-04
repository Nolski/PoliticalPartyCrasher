var gulp    = require('gulp'),
    ngmin   = require('gulp-ngmin'),
    concat  = require('gulp-concat');

gulp.task('scripts', function () {
    gulp
        .src([
            'bower_components/momentjs/min/moment.min.js',
            'bower_components/d3/d3.min.js',
            'bower_components/url/url.min.js',
            'bower_components/angular/angular.min.js',
            'bower_components/leaflet/dist/leaflet.js',
            'bower_components/leaflet-sidebar/src/L.Control.Sidebar.js',
            'bower_components/leaflet-omnivore/leaflet-omnivore.min.js',
            'client/*.js'
        ])
        .pipe(concat('scripts.min.js'))
        .pipe(gulp.dest('static/js/'));
});
