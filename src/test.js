'use strict';

var GameLoop = require('./blackjack/game-loop');
var makePlayer = require('./human-player/index');

var gameLoop = new GameLoop(
  true,
  6,
  1000,
  100,
  2000
);

var player = makePlayer('127.0.0.1', {});

gameLoop
  .join(
    player, {
      spectator: false
    }
  );

// function playLoop () {
//   return gameLoop
//     .start()
//     .then(
//       () => {
//         return playLoop();
//       }
//     );
// }

gameLoop.startLoop();

// playLoop();
