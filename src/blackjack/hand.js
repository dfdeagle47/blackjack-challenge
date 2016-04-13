'use strict';

const actions = require('./actions');
const states = require('./states');

class Hand {

  constructor (cards, bet) {
    this.cards = cards;
    this.bet = bet;

    this.hasDoubledDown = false;
    this.state = states.PENDING;
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

  setBet (bet) {
    return (this.bet = bet);
  }

  addToBet (bet) {
    return (this.bet += bet);
  }

  getHasDoubledDown () {
    return this.hasDoubledDown;
  }

  setHasDoubledDown (hasDoubledDown) {
    return (this.hasDoubledDown = hasDoubledDown, this.hasDoubledDown);
  }

  getState (state) {
    return this.state;
  }

  setState (state) {
    this.state = state;
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
        this
          .cards
          .map(card => card.getValues())
      )
      .map(combination => {
        return combination
          .reduce(
            (total, value) => total + value,
            0
          );
      });
  }

  getBestTotal () {
    return this
      .getTotals()
      .filter(
        total => {
          return total <= 21;
        }
      )
      .sort(
        (total1, total2) => total2 - total1
      )[0];
  }

  hasBust () {
    return this
      .getTotals()
      .filter(total => total <= 21)
      .length === 0;
  }

  hasBlackjack () {
    return this
      .getTotals()
      .filter(total => total === 21)
      .length !== 0;
  }

  hasNaturalBlackjack () {
    return (
      this.hasBlackjack() &&
      this.cards.length === 2
    );
  }

  canHit () {
    return this.getHasDoubledDown() === false;
  }

  canStand () {
    return true;
  }

  canDoubleDown () {
    return (
      this.getHasDoubledDown() === false &&
      this.cards.length === 2 &&
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

    if (this.hasBust()) {
      nextActions.push(actions.STAND);
    } else if (this.hasBlackjack()) {
      nextActions.push(actions.STAND);
    } else {
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
    }

    return nextActions;
  }

  serializeForPlayers (isEnd) {
    return {
      state: this.state,
      bet: this.bet,
      cards: this
        .cards
        .map(
          card => card.serializeForPlayers(isEnd)
        )
    };
  }

}

module.exports = Hand;
