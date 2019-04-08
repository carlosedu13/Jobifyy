const gulp  = require('gulp');
const html = require('gulp-htmlmin');
const sass = require('gulp-sass');
const notify = require('gulp-notify');
const browserSync = require('browser-sync').create();

//html
gulp.task('html', async function(){
    return gulp.src('./src/index.html')
    .pipe(html({collapseWhitespace:true}))
    .on('error', notify.onError('Error: <%= error.message %'))
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.stream())
});

//Browser Sync
gulp.task('BS', gulp.parallel('html'), function(){
    browserSync.init({
        server:{
            baseDir: './dist/'
        }
    })

    gulp.watch('./src/index.html', [html]);
});

gulp.task('default', gulp.parallel("BS"));
