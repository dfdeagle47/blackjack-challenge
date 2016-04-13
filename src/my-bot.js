var network = require('./network');
var minimist = require('minimist');

var argv = minimist(process.argv.slice(2));

if (!argv.table) {
  console.log('--table required');
  process.exit(1);
}

function start () {
  var game = network.createClient(argv.table).join({
    name: 'my-bot',
    onGameStart (state, makeBet) {
      if (state.players[state.playerIndex].spectator) {
        game.quit();
        setTimeout(() => start(), 10000);
      }
      makeBet({ amount: 10 });
    },
    onGameTurn (state, makeMove) {
      makeMove({ move: state.moves[0] });
    },
    onGameEnd (state) {
      console.log(JSON.stringify(state, null, 2));
    }
  });
}

console.log(`starting bot on ${argv.table}`);
start();
