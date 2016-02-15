var gulp = require('gulp'),
    browserify = require('browserify'),
    through2 = require('through2'),
    spawn = require('child_process').spawn,
    node;

gulp.task('build', function () {
    return gulp.src('./src/Main.js')
        .pipe(through2.obj(function (file, enc, next) {
            browserify(file.path, { debug: process.env.NODE_ENV === 'development' })
                .transform(require('babelify'))
                .bundle(function (err, res) {
                    if (err) { return next(err); }

                    file.contents = res;
                    next(null, file);
                });
        }))
        .on('error', function (error) {
            console.log(error.stack);
            this.emit('end');
        })
        .pipe(require('gulp-rename')('main.js'))
        .pipe(gulp.dest('/srv/http/public/dumtard/test/games/ToT/js'));
});

gulp.task('watch', function() {
    gulp.watch(['./src/**/*.js'], ['build']);
});

gulp.task('default', ['watch']);

process.on('exit', function() {
    if (node) {
        node.kill();
    }
});
