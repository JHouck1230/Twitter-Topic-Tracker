'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var rimraf = require('gulp-rimraf');
var ngAnnotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');


///////////////////////////////////////////
// General Tasks

gulp.task('default', ['js', 'css', 'watch']);

gulp.task('watch', ['watch:js', 'watch:css']);

///////////////////////////////////////////
// Javascript Tasks

gulp.task('js', ['clean:js'], function() {
	return gulp.src('client/js/**/*.js')
		.pipe(plumber())
		.pipe(ngAnnotate())
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(concat('bundle.js'))
		.pipe(uglify())
		.pipe(gulp.dest('public/js'));
});

gulp.task('watch:js', function() {
	return gulp.watch('client/js/**/*.js', ['js']);
});

gulp.task('clean:js', function() {
	return gulp.src('public/js', { read: false })
		.pipe(rimraf());
});

///////////////////////////////////////////
// CSS Tasks

gulp.task('css', ['clean:css'], function() {
	return gulp.src(['client/scss/**/*.scss', 'client/scss/**/*.sass'])
		.pipe(plumber())
		.pipe(sass())
		.pipe(gulp.dest('public/css'));
});

gulp.task('watch:css', function() {
	return gulp.watch(['client/scss/**/*.scss', 'client/scss/**/*.sass'], ['css']);
});

gulp.task('clean:css', function(){
	return gulp.src('public/css', { read: false })
		.pipe(rimraf());
});
