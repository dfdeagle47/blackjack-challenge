/* globals describe, it */

'use strict';

const assert = require('assert');

const Deck = require('../src/blackjack/deck');

describe('Deck', () => {
  it('52 cards per deck', () => {
    const numDecks = 6;
    const deck = new Deck(
      numDecks
    );

    assert.strictEqual(deck.cardCount(), 52 * numDecks);
  });

  it('13 of each suit per deck', () => {
    const numDecks = 6;
    const suits = [
      'hearts',
      'diamonds',
      'spades',
      'clubs'
    ];
    const deck = new Deck(
      numDecks
    );

    suits.forEach(
      (suit) => {
        assert.strictEqual(
          deck
            .cards
            .reduce(
              (count, card) => count + (card.getSuit() === suit ? 1 : 0),
              0
            ),
          13 * numDecks
        );
      }
    );
  });

  it('4 of each rank per deck', () => {
    const numDecks = 6;
    const ranks = [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13
    ];
    const deck = new Deck(
      numDecks
    );

    ranks.forEach(
      (rank) => {
        assert.strictEqual(
          deck
            .cards
            .reduce(
              (count, card) => count + (card.getRank() === rank ? 1 : 0),
              0
            ),
          4 * numDecks
        );
      }
    );
  });
});
