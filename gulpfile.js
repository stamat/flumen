/*jshint node: true, strict: false */

var fs = require('fs');
var gulp = require('gulp');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var concat = require('gulp-concat');

var manifest = require('./bower.json');

// ----- hint ----- //

var jshint = require('gulp-jshint');

gulp.task( 'hint-js', function() {
  return gulp.src(manifest.main)
    .pipe( jshint() )
    .pipe( jshint.reporter('default') );
});

// regex for banner comment
var reBannerComment = new RegExp('^\\s*(?:\\/\\*[\\s\\S]*?\\*\\/)\\s*');

function getBanner(suf) {
  if (!suf) {
      suf = 'PACKAGED'
  }

  var src = fs.readFileSync( manifest.main, 'utf8' );
  var matches = src.match( reBannerComment );
  var banner = matches[0].replace( 'Flumen', 'Flumen ' + suf );
  return banner;
}

function addBanner( str ) {
  return replace( /^/, str );
}

// If the package is in the devDependancies of this project's bower.json
function ifDevDependancy(val) {
    if (!manifest.hasOwnProperty('devDependencies')) {
        return false;
    }

    for (var k in manifest.devDependencies) {
        if (k === val) {
            return true;
        }
    }

    return false;
}

//Get the scripts to prepare a package
function packagesPrepare(callback) {
    var paths = [];

    fs.readdir('bower_components', function(err, items) {

      for (var i=0; i<items.length; i++) {
          var man = require('./bower_components/' + items[i] + '/bower.json');

          if (ifDevDependancy(items[i])) {
              continue;
          }
          paths.push('./bower_components/' + items[i] + '/' + man.main);
      }

      if (callback) {
          callback(paths);
      }
    });

    return paths;
}


// ----- uglify ----- //

var uglify = require('gulp-uglify');

gulp.task( 'uglify', function() {
    var banner = getBanner('MINIFIED');
    gulp.src(manifest.main)
        .pipe( uglify() )
        .pipe( addBanner( banner ) )
        .pipe( rename('flumen.min.js') )
        .pipe(gulp.dest(''));

    var banner = getBanner();
    gulp.src('flumen.pkgd.js')
        .pipe( uglify() )
        .pipe( addBanner( banner ) )
        .pipe( rename('flumen.pkgd.min.js') )
        .pipe(gulp.dest(''));
});


gulp.task('build', ['hint-js', 'uglify'], function() {
    packagesPrepare(function(paths) {
        paths.push(manifest.main);
        return gulp.src(paths)
            .pipe(concat('flumen.pkgd.js'))
            .pipe(gulp.dest(''));
    });
});

// ----- default ----- //

gulp.task( 'default', [
  'build'
]);
