'use strict';

import Card from './card';

class Deck {

  constructor (numDecks) {
    this.numDecks = numDecks;

    this.cards = this.shuffle(
      this.generate(
        this.numDecks
      )
    );
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

exports default Deck;
