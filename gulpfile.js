// Gulp plugins
var gulp = require('gulp'),
    connect = require('gulp-connect-php'),
    browsersync = require('browser-sync');

// Server task
gulp.task('server', function() {
    browsersync({
        proxy: '127.0.0.1:8010',
        port: 8080,
        open: true,
        notify: false
    });
    connect.server({
        base: '', port:8010, keepalive: true
    });
});