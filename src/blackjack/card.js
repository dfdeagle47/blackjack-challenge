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

}

module.exports = Card;
