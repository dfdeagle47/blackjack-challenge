'use strict';

const Card = require('./card');

class Deck {

  constructor (numDecks) {
    this.numDecks = numDecks;
    this.cards = [];

    this.generateAndShuffle();
  }

  generateAndShuffle () {
    this.cards = this.shuffle(
      this.generate(
        this.numDecks
      )
    );
  }

  popCard () {
    return this.cards.pop();
  }

  cardCount () {
    return this.cards.length;
  }

  generate (numDecks) {
    const cards = [];

    for (let i = 1; i <= 52 * numDecks; i++) {
      cards.push(
        new Card(i)
      );
    }

    return cards;
  }

  shuffle (cards) {
    return this.doFisherYatesShuffle(cards);
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
