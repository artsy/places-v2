import fs from 'fs';
import path from 'path';
import gulp from 'gulp';
import del from 'del';
import gutil from 'gulp-util';
import source from 'vinyl-source-stream';
import babelify from 'babelify';
import watchify from 'watchify';
import browserify from 'browserify';
import browserSync from 'browser-sync';
import stylus from 'gulp-stylus';
import nib from 'nib';
import uglify from 'gulp-uglify';
import minifyCSS from 'gulp-minify-css';
import RevAll from 'gulp-rev-all';
import rename from 'gulp-rename';
import awspublish from 'gulp-awspublish';
import glob from 'glob';

// Teardown the temp directory
gulp.task('teardown', () => {
  return del('public');
});

// Compile Jade templates
let assetPath = (assets, path) => (path) => (assets[path] || path).replace(/^\//, '');

// Compile JavaScript
let bundle, bundler, options, config;

config = {
  entries: ['./assets/javascripts/index.js'],
  extensions: ['.js'],
  outputFile: 'index.js',
  outputDir: './public/javascripts'
};

options = Object.assign(
  { entries: config.entries, extensions: config.extensions },
  watchify.args
);

bundler = browserify(options);
bundler.transform(babelify.configure({
  presets: ['es2015']
}));

bundle = () => {
  return bundler
    .bundle()
    .on('error', function(err) {
      gutil.log(err.message);
      browserSync.notify('Browserify Error!');
      this.emit('end');
    })
    .pipe(source(config.outputFile))
    .pipe(gulp.dest(config.outputDir))
    .pipe(browserSync.stream({ once: true }));
};

let watch = false;

gulp.task('build:js', () => {
  if (watch) {
    bundler = watchify(bundler);
    bundler.on('update', bundle);
    bundler.on('log', gutil.log);
  }
  return bundle();
});

// Compile Stylus => CSS
gulp.task('build:css', () => {
  return gulp.src('./assets/stylesheets/index.styl')
    .pipe(stylus({ use: [nib()] }))
    .pipe(gulp.dest('./public/stylesheets'))
    .pipe(browserSync.stream());
});

// Copy over images
gulp.task('build:images', () => {
  return gulp.src('assets/images/*')
    .pipe(gulp.dest('public/images'));
});

// Minify JavaScript
gulp.task('compress:js', () => {
  return gulp.src('public/javascripts/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('public/javascripts'));
});

// Minify CSS
gulp.task('compress:css', () => {
  return gulp.src('public/stylesheets/*.css')
    .pipe(minifyCSS())
    .pipe(gulp.dest('public/stylesheets'));
});

// Asset revving
gulp.task('rev', () => {
  let revAll = new RevAll();
  return gulp.src([
      'public/stylesheets/index.css',
      'public/javascripts/index.js',
      'public/images/**/*'
    ], { base: path.join(process.cwd(), 'public') })
    .pipe(revAll.revision())
    .pipe(gulp.dest('public'))
    .pipe(revAll.manifestFile())
    .pipe(gulp.dest('public'));
});

gulp.task('rev:clean', gulp.series('rev', () => {
  let manifest, toClean;
  manifest = JSON.parse(fs.readFileSync('public/rev-manifest.json', 'utf8'));
  toClean = Object.keys(manifest).map((path) => `public/${path}`);
  return del(toClean);
}));

// Configure builds
gulp.task('development:build',
  gulp.series('teardown',
    gulp.parallel(
      'build:js',
      'build:css',
      'build:images'
    )
  )
);

gulp.task('production:build',
  gulp.series('teardown',
    gulp.parallel(
      'build:js',
      'build:css',
      'build:images'
    ),
    gulp.parallel(
      'compress:js',
      'compress:css'
    ),
    'rev:clean'
  )
);

// Watch
gulp.task('set:watch', (done) => {
  watch = true;
  done();
});

gulp.task('watch', gulp.series('set:watch', 'development:build', (done) => {
  browserSync.init({
    open: false,
    port: 5010,
    proxy: 'localhost:5000'
  });

  gulp.watch('assets/stylesheets/index.styl',
    gulp.series('build:css')
  );

  done();
}));

// Deploy
gulp.task('deploy', gulp.series('production:build', () => {
  let publisher = awspublish.create({
    params: { Bucket: process.env.AWS_S3_BUCKET },
    region: process.env.AWS_REGION
  });

  return gulp.src('./public/**/*')
    .pipe(awspublish.gzip())
    .pipe(publisher.publish())
    .pipe(publisher.sync())
    .pipe(publisher.cache())
    .pipe(awspublish.reporter());
}));
