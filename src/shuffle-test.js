'use strict';

const Deck = require('./blackjack/deck');
const deck = new Deck(6);

const newDeck = deck.generate(6);

newDeck.forEach((card) => {
  console.log('value=', card.value, 'suit=', card.getSuit());
});

// console.log(
//   require('util').inspect(
//     deck
//       .cards
//       .map(card => Object.assign(
//           card.serializeForPlayers(), {
//             value: card.value
//           }
//         )
//       ),
//     {
//       colors: true,
//       depth: 100
//     }
//   )
// );

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

