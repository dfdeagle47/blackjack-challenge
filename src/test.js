'use strict';

var GameLoop = require('./blackjack/game-loop');
var network = require('./network');
var http = require('http');

function startTable (port) {
  var gameLoop = new GameLoop(
    true,
    6,
    1000,
    100,
    250,
    0.01
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

[ 3000, 3001, 3002, 3003, 3004, 3005 ].forEach(startTable);
