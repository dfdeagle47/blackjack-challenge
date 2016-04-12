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
    const suitIndex = Math.ceil(
      this.value / Math.ceil(
        this.value / 52
      ) / 13
    );

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

    let rank = rankIndex;
    // let rank = null;

    // if (rankIndex === 1) {
    //   rank = 'ace';
    // } else if (rankIndex >= 2 && rankIndex <= 10) {
    //   rank = rankIndex;
    // } else if (rankIndex === 11) {
    //   rank = 'jack';
    // } else if (rankIndex === 12) {
    //   rank = 'queen';
    // } else if (rankIndex === 13) {
    //   rank = 'king';
    // }

    return rank;
  }

  serializeForPlayers () {
    return {
      suit: this.getSuit(),
      rank: this.getRank()
    };
  }

}

module.exports = Card;
