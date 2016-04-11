var http = require('http');
var server = http.createServer();
var network = require('.');

function simulateGame (game) {
  game = game || {};
  game.player.onGameStart(bet => {
    console.log('server: receive bet', bet);
    game.timeout = setTimeout(() => {
      console.log('server: send turn');
      game.player.onGameTurn({ state: 'hello' }, move => {
        console.log('server: receive move', move);
        game.timeout = setTimeout(() => {
          console.log('server: send end');
          game.player.onGameEnd({ state: 'goodbye' });
          simulateGame(game);
        }, 2000);
      });
    }, 2000);
  });
  return {
    quit () {
      clearTimeout(game.timeout);
    }
  };
}

network.createServer(server, {
  join (player) {
    var simulatedGame = simulateGame({ player: player });
    return {
      quit () {
        console.log('server: quitting game');
        simulatedGame.quit();
        return Promise.resolve();
      }
    };
  }
});

var app = server.listen(3000, () => {
  var game = network.createClient('http://localhost:3000').join({
    name: 'hello',
    onGameStart (makeBet) {
      console.log('client: starting game');
      setTimeout(() => {
        console.log('client making bet');
        makeBet({ amount: 5 });
      }, 1000);
    },
    onGameTurn (state, makeMove) {
      console.log('client: game state', state);
      setTimeout(() => {
        console.log('client making move');
        makeMove({ move: 'stand' });
      }, 1000);
    },
    onGameEnd (state) {
      console.log('client: game end', state);
    }
  });

  setTimeout(() => {
    game.quit();
    //app.close();
  }, 11000);
});
