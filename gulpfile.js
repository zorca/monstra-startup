// Theme name
var themename = 'landing';

// Gulp plugins
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),
    jade = require('gulp-jade'),
    scss = require('gulp-sass'),
    connect = require('gulp-connect-php'),
    browsersync = require('browser-sync'),
    templatesglob = require('gulp-jade-globbing'),
    stylesglob = require('gulp-css-globbing');

var displayError = function(error) {

    // Initial building up of the error
    var errorString = '[' + error.plugin + ']';
    errorString += ' ' + error.message.replace("\n",''); // Removes new line at the end

    // If the error contains the filename or line number add it to the string
    if(error.fileName)
        errorString += ' in ' + error.fileName;

    if(error.lineNumber)
        errorString += ' on line ' + error.lineNumber;

    // This will output an error like the following:
    // [gulp-sass] error message in file_name on line 1
    gutil.log(gutil.colors.red(errorString));
}

// Bower task
gulp.task('bower', function() {
    return gulp.src('./bower_components/**/fonts/*.**')
        .pipe(gulp.dest('./public/assets/fonts/'))
});

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

// Task JADE
gulp.task('templates', function() {
    return gulp.src('./app/themes/'+themename+'/**/[^_]*.jade')
        .pipe(templatesglob())
        .on('error', function(err){
            displayError(err);
            this.emit('end');
        })
        .pipe(jade({
            pretty: true
        }))
        .on('error', function(err){
            displayError(err);
            this.emit('end');
        })
        .pipe(rename({
            extname: ".php"
        }))
        .pipe(gulp.dest('./public/themes/'+themename+'/'))
});

// Task SASS
gulp.task('styles', function() {
    return gulp.src('./app/themes/'+themename+'/scss/[^_]*.scss')
        .pipe(stylesglob({
            extensions: ['.css', '.scss'],
            scssImportPath: {
                leading_underscore: false,
                filename_extension: false
            }
        }))
        .pipe(scss({errLogToConsole: true, includePaths: ['./bower_components/foundation/scss']}))
        .on('error', function(err){
            displayError(err);
            this.emit('end');
        })
        .pipe(gulp.dest('./public/themes/'+themename+'/css/'));
});

// Watch tasks
gulp.task('watch', function() {
    gulp.watch('./app/themes/'+themename+'/**/*.jade', ['templates']);
    gulp.watch('./app/themes/'+themename+'/**/*.scss', ['styles']);
});

gulp.task('default', ['server','templates','styles','watch']);