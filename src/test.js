'use strict';

var GameLoop = require('./blackjack/game-loop');
var makePlayer = require('./human-player/index');

var gameLoop = new GameLoop(
  true,
  6,
  1000,
  100
);

var player = makePlayer(
  '127.0.0.1',
  {
  }
);

gameLoop.join('127.0.0.1');

gameLoop.table.players[0].triggerGameStart = function (state) {
  return new Promise((resolve, reject) => {
    player.onGameStart(state, function (bet) {
      resolve(bet.amount);
    });
  });
};

gameLoop.table.players[0].triggerHandActions = function (state) {
  return new Promise((resolve, reject) => {
    player.onGameTurn(state, function (action) {
      resolve(action.move);
    });
  });
};

gameLoop.table.players[0].triggerGameEnd = function (state) {
  player.onGameEnd(state);
  return Promise.resolve();
};

function playLoop () {
  return gameLoop
    .start()
    .then(
      () => {
        return playLoop();
      }
    );
}

playLoop();
