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
    return cards.sort(() => Math.random() > Math.random());
  }

}

module.exports = Deck;
