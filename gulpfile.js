var gulp = require('gulp');
var del = require('del');
var notify = require('gulp-notify');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var include = require('gulp-include');
var include = require('gulp-include');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var gutil = require('gulp-util');
var compass = require('gulp-compass');

// Configuration
var config = {
	styles: {
		src: 'sass/**/*.scss',
		dest: 'OUTPUT/css/',
		sourcemapDest: '.', // i.e. current directory
		options: {
			sass: {
				outputStyle: 'compressed', // nested, expanded, compact, compressed
				precision: 10 // level of precision on numerical values (i.e. 10.0 vs 10.0000001)
			},
			autoprefixer: {
				browsers: ['last 2 versions', '> 3%', 'Firefox ESR'],
				cascade: false
			}
		}
	},
	scripts: {
		src: 'js/*.js',
		dest: 'OUTPUT/min/',
		sourcemapDest: '.', // i.e. current directory
		rename: {
			suffix: '-min'
		}
	}
};

// Styles (CSS / Sass)
gulp.task('styles', function() {
	return gulp
		.src(config.styles.src)
		.pipe(sourcemaps.init())
		.pipe(sass(config.styles.options.sass).on('error', sass.logError))
		.pipe(sass(config.styles.options.sass).on('error', notify.onError({
			title: 'Sass Compilation Error',
			message: '<%= error.message %>'
		})))
		.pipe(autoprefixer(config.styles.options.autoprefixer))
		.pipe(sourcemaps.write(config.styles.sourcemapDest))
		.pipe(gulp.dest(config.styles.dest))
		// .pipe(notify('Sass Compilation Complete'));
});

// Compass
gulp.task('compass', ['clean'], function() {
	gulp.src(config.styles.src)
	.pipe(compass({
		relative: true,
		style: 'compressed',
		css: 'COMPASS',
	}))
});

// Cleaner for Compass
gulp.task('clean', function() {
	return del(['COMPASS/**/*']);
});

// JavaScript
gulp.task('scripts', function() {
	return gulp
		.src(config.scripts.src)
		.pipe(sourcemaps.init())
		.pipe(include()).on('error', console.log)
		.pipe(uglify())
		.pipe(rename(config.scripts.rename))
		.pipe(sourcemaps.write(config.scripts.sourcemapDest))
		.pipe(gulp.dest(config.scripts.dest))
		// .pipe(notify('JS Compilation Complete'));
});

// Watcher
gulp.task('watch', function() {
	gulp.watch(config.styles.src, ['styles']);
	gulp.watch(config.scripts.src, ['scripts']);
});

// Default Task
gulp.task('default', [
	'styles',
	'scripts',
	'watch'
]);
