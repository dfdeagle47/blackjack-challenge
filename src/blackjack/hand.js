'use strict';

import actions from './actions';

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

  setBet (bet) {
    return (this.bet = bet, bet);
  }

  setHasDoubledDown (hasDoubledDown) {
    this.hasDoubleDowned = hasDoubledDown;
  }

  getCombinations () {
    return this
      .cards
      .reduce(
        (combinations, card) => {
          return combinations
            .reduce(
              (combinations, combination) => {
                return combinations.concat(
                  combination.concat(
                    card
                      .getValues()
                      .map(combination => combination.concat(value))
                    )
                  );
              },
              []
            );
        },
        []
      ); 
  }

  getTotals () {
    return this
      .getCombinations()
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
        )
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

exports default Hand;
