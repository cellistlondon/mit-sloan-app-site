var gulp = require('gulp');
var path = require('path');
var browserSync = require('browser-sync');
var cp = require('child_process');

var bootstrap_path = path.join(__dirname, 'node_modules', 'bootstrap');

console.log('cellist-co-site: building bootstrap from: ' + bootstrap_path);

var gulp_grunt = require('gulp-grunt')(gulp, {
    base: bootstrap_path,
    prefix: 'gulp-grunt-bootstrap-',
    verbose: false
});

var paths = {
    bootstrap_css: [bootstrap_path + '/dist/css/*.min.css'],
    bootstrap_fonts: [bootstrap_path + '/dist/fonts/*'],
    bootstrap_js: [bootstrap_path + '/dist/js/*.min.js'],
    dist_css: './css',
    dist_fonts: './fonts',
    dist_js: './js'
};

gulp.task('css', ['gulp-grunt-bootstrap-dist'], function() {
    return gulp.src(paths.bootstrap_css)
        .pipe(gulp.dest(paths.dist_css));
});

gulp.task('js', ['gulp-grunt-bootstrap-dist'], function() {
    return gulp.src(paths.bootstrap_js)
        .pipe(gulp.dest(paths.dist_js));
});

gulp.task('fonts', ['gulp-grunt-bootstrap-dist'], function() {
    return gulp.src(paths.bootstrap_fonts)
        .pipe(gulp.dest(paths.dist_fonts));
});
gulp.task('assets', ['css', 'js', 'fonts']);

gulp.task('jekyll-build', ['assets'], function(done) {
    return cp.spawn('bundle', ['exec', 'jekyll', 'build'], {
            stdio: 'inherit'
        })
        .on('close', done);
});

gulp.task('finish',['jekyll-build'], function() {
    //required to exit time-grunt launched within the bootstrap dist grunt task
    process.exit();
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

gulp.task('default',['browser-sync']);