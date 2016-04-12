'use strict';

class Card {

  constructor (value) {
    this.value = value;
  }

  getIndex () {
    return this.value % 13;
  }

  getValues () {
    const cardIndex = this.getIndex();

    return cardIndex === 1
      ? [1, 11]
      : (
          cardIndex >= 10 ||
          cardIndex === 0
        )
        ? [10]
        : [cardIndex];
  }

  getSuit () {
    const deckIndex = this.value % 52;
    const normalizedDeckIndex = deckIndex === 0 ? 52 : deckIndex;
    const suitIndex = Math.ceil(normalizedDeckIndex / 13);

    let suit = null;

    switch (suitIndex) {
      case 1:
        suit = 'hearts';
        break;
      case 2:
        suit = 'diamonds';
        break;
      case 3:
        suit = 'spades';
        break;
      case 4:
        suit = 'clubs';
        break;
    }

    return suit;
  }

  getRank () {
    const cardIndex = this.getIndex();
    const rankIndex = cardIndex === 0 ? 13 : cardIndex;

    return rankIndex;
  }

  serializeForPlayers () {
    return {
      suit: this.getSuit(),
      rank: this.getRank()
    };
  }

}

module.exports = Card;
