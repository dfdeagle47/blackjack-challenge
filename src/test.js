'use strict';

var GameLoop = require('./blackjack/game-loop');
var network = require('./network');
var http = require('http');

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
server.listen(3000);
