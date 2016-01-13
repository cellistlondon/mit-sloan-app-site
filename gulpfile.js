var gulp = require('gulp');
var path = require('path');
var concatCss = require('gulp-concat-css');
var concat = require('gulp-concat');
var browserSync = require('browser-sync');
var cp = require('child_process');

var bootstrap_path = path.join(__dirname, 'node_modules', 'bootstrap');
var fa_path = path.join(__dirname, 'node_modules', 'font-awesome');
var jquery_path = path.join(__dirname, 'node_modules', 'jquery');


console.log('cellist-co-site: building bootstrap from: ' + bootstrap_path);

//used to build bootstrap
var gulp_grunt = require('gulp-grunt')(gulp, {
    base: bootstrap_path,
    prefix: 'gulp-grunt-bootstrap-',
    verbose: false
});

var paths = {
    bootstrap_mincss: [bootstrap_path + '/dist/css/*.min.css'],
    fa_mincss: [fa_path + '/css/*.min.css'],
    bootstrap_fonts: [bootstrap_path + '/dist/fonts/*'],
    fa_fonts: [fa_path + '/fonts/*'],
    bootstrap_minjs: [bootstrap_path + '/dist/js/*.min.js'],
    jquery_minjs: [jquery_path + '/jquery.min.js'],
    app_less: ['./_less/*'],
    dist_css: './css',
    dist_fonts: './fonts',
    dist_js: './js'
};

gulp.task('css', function() {
    return gulp.src(paths.bootstrap_mincss.concat(paths.fa_mincss).concat(paths.app_less))
        .pipe(concat('cellist.css'))
        .pipe(gulp.dest(paths.dist_css));
});

gulp.task('js', function() {
    return gulp.src(paths.jquery_minjs.concat(paths.bootstrap_minjs))
        .pipe(concat('cellist.js'))
        .pipe(gulp.dest(paths.dist_js));
});

gulp.task('fonts', function() {
    return gulp.src(paths.bootstrap_fonts.concat(paths.fa_fonts))
        .pipe(gulp.dest(paths.dist_fonts));
});
gulp.task('assets', ['css', 'js', 'fonts']);

gulp.task('jekyll-build', ['assets'], function(done) {
    return cp.spawn('bundle', ['exec', 'jekyll', 'build'], {
            stdio: 'inherit'
        })
        .on('close', done);
});



/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
            },
        port: process.env.PORT||3000,
        host: process.env.IP
    });
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    //gulp.watch(['_scss/*.scss', '_scss/components/*.scss', '_scss/pages/*.scss'], ['sass']);
    gulp.watch(['*.html', '_layouts/*.html', '_includes/*.html', '_posts/*', 'img/*', 'js/*.js','_less/*.css'], ['jekyll-rebuild']);
});
gulp.task('build', ['jekyll-build']);
gulp.task('default',['browser-sync','watch']);

//not required unless bootstrap source modified (not recommended)
//install dependent npm packages inside bootstrap directory before running:
//  cd node_modules/bootstrap
//  npm install
gulp.task('bootstrap-build',['finish-bootstrap']);

gulp.task('finish-bootstrap',['gulp-grunt-bootstrap-dist'], function() {
    //required to exit time-grunt launched within the bootstrap dist grunt task
    process.exit();
});