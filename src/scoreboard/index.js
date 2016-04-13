'use strict';

var pathUtil = require('path');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var EventEmitter = require('events').EventEmitter;
var Table = require('cli-table');

function writer (path) {
  var queued = null;
  var pending = null;

  function writeQueuedToFile () {
    if (queued === null) {
      return Promise.resolve();
    }
    var content = JSON.stringify(queued);
    queued = null;
    return fs.writeFileAsync(path, content, { encoding: 'utf-8' })
      .then(() => {
        return writeQueuedToFile();
      });
  }

  return function write (json) {
    queued = json;
    if (!pending) {
      pending = writeQueuedToFile().then(() => pending = null);
    }
    return pending;
  };
}

class Scoreboard extends EventEmitter {
  constructor (path) {
    super();
    this._scoresPath = path;
    var persistence = writer(this._scoresPath);
    this.on('update', () => {
      persistence(this.scores);
    });
  }
  get scores () {
    if (!this._scores) {
      try {
        this._scores = JSON.parse(fs.readFileSync(this._scoresPath, { encoding: 'utf-8' })) || {};
      } catch (e) {
        this._scores = {};
      }
    }
    return this._scores;
  }
  _generateName () {
    return `scoreboard-${Math.floor(Math.random() * 1000000000)}`;
  }
  getSpectator () {
    var board = this;
    return {
      name: this._generateName(),
      onGameStart: (state, makeBet) => makeBet({ amount: 0 }),
      onGameTurn: (state, makeMove) => makeMove({ move: state.moves[0] }),
      onGameEnd (state) {
        state.players
          .filter(player => !player.spectator && !player.dealer)
          .forEach(player => {
            if (!board.scores[player.name]) {
              board.scores[player.name] = {
                name: player.name,
                bankroll: 0,
                gamesPlayed: 0,
                handsPlayed: 0,
                handsWon: 0,
                handsDraw: 0,
                handsLost: 0,
                handsSplit: 0
              };
            }
            var playerScore = board.scores[player.name];
            playerScore.bankroll = player.bankroll;
            playerScore.gamesPlayed += 1;
            playerScore.handsPlayed += player.hands.length;
            playerScore.handsWon += player.hands.filter(hand => hand.state === 'WIN').length;
            playerScore.handsDraw += player.hands.filter(hand => hand.state === 'DRAW').length;
            playerScore.handsLost += player.hands.filter(hand => hand.state === 'LOSE').length;
            playerScore.handsSplit += player.hands.length - 1;
          });
        board.emit('update', board.scores);
      }
    };
  }
  render () {
    var table = new Table({
      head: ['name', 'bankroll', 'games', 'hands', 'wins', 'draws', 'losses', 'splits']
    });
    Object.keys(this.scores)
      .map(name => {
        var player = this.scores[name];
        return [
          name,
          `\$${player.bankroll}`,
          player.gamesPlayed,
          player.handsPlayed,
          player.handsWon,
          player.handsDraw,
          player.handsLost,
          player.handsSplit
        ];
      })
      .forEach(row => table.push(row));
    return table.toString();
  }
}

function createScoreboard () {
  var scoresPath = pathUtil.resolve(__dirname, './scores.json');
  return new Scoreboard(scoresPath);
}

module.exports = createScoreboard;
