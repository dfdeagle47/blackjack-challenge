'use strict';

const Deck = require('./blackjack/deck');
const deck = new Deck(6);

console.log(
  require('util').inspect(
    deck
      .cards
      .map(card => card.serializeForPlayers()),
    {
      colors: true,
      depth: 100
    }
  )
);

// console.log(
//   [
//     1,
//     2,
//     3,
//     4,
//     5,
//     6,
//     7,
//     8,
//     9,
//     10
//   ]
//   .sort((a, b) => Math.random() >= Math.random())
// );

