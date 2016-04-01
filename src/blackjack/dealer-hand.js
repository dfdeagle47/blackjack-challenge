'use strict';

import actions from './actions';
import Hand from './hand';

class DealerHand extends Hand {

  constructor (s17, cards) {
    this.s17 = s17;
    this.cards = cards;
  }

  hasS17Rule () {
    return this.s17 === true;
  }

  hasSoft17OrLower () {
    return this
      .getCombinations()
      .filter(function (combination) {
        return (
          combination
            .reduce(
              (total, value) => total + value,
              0
            ) <= 17 &&
          combination.indexOf(11) !== -1
        );
      })
      .length !== 0;
  }

  hasHard16OrLower () {
    return this
      .getCombinations()
      .filter(function (combination) {
        return (
          combination
            .reduce(
              (total, value) => total + value,
              0
            ) <= 16 &&
          combination.indexOf(11) === -1
        );
      })
      .length !== 0;
  }

  getNextActions () {
    const nextActions = [];

    if (
      (
        this.hasS17Rule() &&
        this.hasSoft17OrLower()
      ) ||
      this.hasHard16OrLower()
    ) {
      nextActions.push(actions.HIT);
    }
    else {
      nextActions.push(actions.STAND);
    }

    return nextActions;
  }

}

exports default Hand;
