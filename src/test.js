'use strict';

var GameLoop = require('./blackjack/game-loop');
var gameLoop = new GameLoop(
  true,
  6,
  1000 * 1000,
  100
);

gameLoop.join('127.0.0.1');

gameLoop.start();

// gameLoop.next();
