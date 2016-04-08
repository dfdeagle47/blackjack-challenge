'use strict';

const actions = require('./actions');

class Hand {

  constructor (cards, bet) {
    this.cards = cards;
    this.bet = bet;

    this.hasDoubledDown = false;
  }

  addCard (card) {
    return (this.cards.push(card), card);
  }

  popCard () {
    return this.cards.pop();
  }

  getBet () {
    return this.bet;
  }

  addToBet (bet) {
    return (this.bet += bet);
  }

  setHasDoubledDown (hasDoubledDown) {
    this.hasDoubleDowned = hasDoubledDown;
  }

  getCombinations (cards) {
    const card = cards[0];

    if (cards.length === 1) {
      return card;
    }

    const remainingCombinations = this.getCombinations(
      cards.slice(1)
    );
    const combinations = [];
    const ilen = remainingCombinations.length;
    const jlen = card.length;
    let i = 0;
    let j = 0;

    for (; i < ilen; i++) {
      for (j = 0; j < jlen; j++) {
        combinations.push(
          (
              Array.isArray(
                card[j]
              )
              ? card[j]
              : [ card[j] ]
          ).concat(
            remainingCombinations[i]
          )
        );
      }
    }

    return combinations;
  }

  getTotals () {
    return this
      .getCombinations(
        this.cards
      )
      .map(combination => {
        return combination
          .reduce(
            (total, value) => total + value,
            0
          );
      });
  }

  hasBust () {
    return this
      .getTotals()
      .filter(total => total < 21)
      .length !== 0;
  }

  hasBlackJack () {
    return this
      .getTotals()
      .filter(total => total === 21)
      .length !== 0;
  }

  hasNaturalBlackJack () {
    return (
      this.hasBlackJack() &&
      this.cards.length === 2
    );
  }

  canHit () {
    return this.hasDoubledDown === false;
  }

  canStand () {
    return true;
  }

  canDoubleDown () {
    return (
      this.hasDoubledDown === false &&
      this
        .getTotals()
        .filter(total => (
          total === 9 ||
          total === 10 ||
          total === 11
        ))
        .length !== 0
    );
  }

  canSplit () {
    return (
      this.cards.length === 2 &&
      this.cards[0].getIndex() === this.cards[1].getIndex()
    );
  }

  getNextActions () {
    const nextActions = [];

    if (this.canHit()) {
      nextActions.push(actions.HIT);
    }

    if (this.canStand()) {
      nextActions.push(actions.STAND);
    }

    if (this.canDoubleDown()) {
      nextActions.push(actions.DOUBLE_DOWN);
    }

    if (this.canSplit()) {
      nextActions.push(actions.SPLIT);
    }

    return nextActions;
  }

}

module.exports = Hand;
