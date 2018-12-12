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
		dest: 'css',
		sourcemapDest: '.', // i.e. current directory
		options: {
			sass: {
				outputStyle: 'compressed', // nested, expanded, compact, compressed
				precision: 5
			},
			autoprefixer: {
				browsers: [	'last 2 Chrome versions',
							'last 2 Edge versions',
							'last 2 Firefox versions',
							'last 2 iOS versions',
							'last 2 Safari versions',
							'> 2% in US',
							'IE 11' ],
				cascade: false
			}
		}
	},
	scripts: {
		src: 'js/*.js',
		dest: 'js/min/',
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

// Compass for older projects. Run with "gulp compass"
gulp.task('compass', ['clean'], function() {
	gulp.src(config.styles.src)
	.pipe(compass({
		sourcemap: true,
		style: 'compressed',
		css: 'COMPASS'
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
