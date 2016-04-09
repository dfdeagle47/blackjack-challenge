var makePlayer = require('.');
var player = makePlayer('Jan', {
  clearScreen: true
});

function loop () {
  player.onGameTurn({
    players: [
      {
        name: 'Jan',
        bankroll: 100,
        hands: [{
          bet: 5,
          cards: [
            {suit: 'hearts', rank: 1},
            {suit: 'clubs', rank: 11},
            {suit: 'spades', rank: 7},
            {suit: 'diamonds', rank: 12},
            {suit: 'diamonds', rank: 10},
            {suit: 'hearts', rank: 13}
          ]
        }, {
          bet: 3,
          cards: [
            {suit: 'clubs', rank: 1},
            {suit: 'diamonds', rank: 9}
          ]
        }]
      }, {
        name: 'Mickael',
        bankroll: 100,
        hands: [{
          bet: 5,
          state: 'lost',
          cards: [
            {suit: 'hearts', rank: 1},
            {suit: 'clubs', rank: 11},
            {suit: 'spades', rank: 7},
            {suit: 'diamonds', rank: 12},
            {suit: 'diamonds', rank: 10},
            {suit: 'hearts', rank: 13}
          ]
        }, {
          bet: 3,
          state: 'win',
          cards: [
            {suit: 'clubs', rank: 1},
            {suit: 'diamonds', rank: 9}
          ]
        }]
      }, {
        name: 'Nils',
        bankroll: 100,
        hands: [ {
          bet: 3,
          state: 'pending',
          cards: [
            {suit: 'clubs', rank: 1},
            {suit: 'diamonds', rank: 9}
          ]
        }]
      }
    ],
    playerIndex: 0,
    handIndex: 0,
    moves: [
      'stand',
      'hit',
      'split',
      'double down'
    ]
  }, () => {
    loop();
  });
}

player.onGameStart(loop);
