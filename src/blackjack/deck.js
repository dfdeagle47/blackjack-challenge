'use strict';

const Card = require('./card');

class Deck {

  constructor (numDecks) {
    this.numDecks = numDecks;
    this.cards = [];
    this.index = 0;

    this.cards = this.generate(
      this.numDecks
    );
    this.shuffle();
  }

  popCard () {
    const card = this.cards[this.index];
    this.index += 1;

    return card;
  }

  cardCount () {
    return this.cards.length - this.index;
  }

  generate (numDecks) {
    const cards = [];
    this.index = 0;

    for (let i = 1; i <= 52 * numDecks; i++) {
      cards.push(
        new Card(i)
      );
    }

    return cards;
  }

  shouldShuffle () {
    return this.index > this.cardCount() / 2;
  }

  shuffle () {
    this.cards = this.doFisherYatesShuffle(
      this.cards
    );
    this.index = 0;
  }

  doFisherYatesShuffle (cards) {
    let rand;
    let tmp;
    let len = cards.length;
    const ret = cards.slice();

    while (len) {
      rand = Math.floor(Math.random() * len--);
      tmp = ret[len];
      ret[len] = ret[rand];
      ret[rand] = tmp;
    }

    return ret;
  }

}

module.exports = Deck;
