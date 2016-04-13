'use strict';

var makePlayer = require('./human-player');
var network = require('./network');
var minimist = require('minimist');

var argv = minimist(process.argv.slice(2));

if (!argv.name) {
  console.log('--name required');
} else if (!argv.table) {
  console.log('--table required');
} else {
  console.log(`starting ${argv.name} on ${argv.table}`);
  var player = makePlayer(argv.name, {});
  network.createClient(argv.table).join(player);
}
