'use strict';

var GameLoop = require('./blackjack/game-loop');
var network = require('./network');
var http = require('http');
var minimist = require('minimist');

function startTable (port) {
  var gameLoop = new GameLoop(
    true,
    6,
    1000,
    100,
    2000
  );
  gameLoop.startLoop();

  var server = http.createServer();
  network.createServer(server, {
    join (player, extra) {
      return gameLoop.join(player, extra);
    }
  });
  server.listen(port, function () {
    console.log(`table started on port ${port}`);
  });
}

var argv = minimist(process.argv.slice(2));

if (!argv.port) {
  console.log('--port required');
} else {
  startTable(argv.port);
}
