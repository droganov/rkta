const gulp = require('gulp');
const spawn = require('child_process').spawn;
const postMortem = require('gulp-postmortem');
const args   = require('yargs').argv;
const fs = require('fs');

const composeArgs = additionalArgs => ['-f', 'docker/docker-compose.yml'].concat(additionalArgs);

const composeOptions = mainOptions => {
  const options = {
    stdio: 'inherit',
    env: {
      APPLICATION_NAME: __dirname.split('/').pop()
    },
  };

  Object.keys(process.env).forEach( key => options.env[key] = process.env[key] );

  if (mainOptions)
    Object.keys(mainOptions).forEach( key => options[key] = mainOptions[key] );

  return options;
}

const spawnCompose = (additionalArgs, options) =>
  spawn('docker-compose', composeArgs(additionalArgs), composeOptions(options));

const subTasks = [];
if (args.f) {
  subTasks.push('fullclean');
} else if (args.b) {
  subTasks.push('build');
}

gulp.task('up', subTasks, cb =>
  spawnCompose(['up', '-d']).on('exit', (code, signal) => {
    code || console.log("All docker containers started, see localhost:80 in browser");
    cb(code);
  })
);

gulp.task('down', () => {
  const out = fs.openSync('docker/down.output','w');
  const child = spawnCompose('stop', {
    detached: true,
    stdio: [ 'ignore', out, out ]
  });
  child.unref();
});

gulp.task('fullclean', cb =>
  spawnCompose(['down' , '--rmi', 'all', '-v', '--remove-orphans']).on('exit', cb)
);

gulp.task('clean', cb =>
  spawnCompose(['down', '-v', '--remove-orphans']).on('exit', cb)
);

gulp.task('build', [ 'clean' ], cb =>
  spawnCompose('build').on('exit', cb)
);

gulp.task('watch', () => {
  gulp
    .src('lib/server.js')
    .pipe(
      postMortem({
        gulp,
        tasks: ['down']
      })
    )
    .pipe(
      gulp.watch('lib/server.js')
    );
});

gulp.task('default', ['watch', 'up']);
