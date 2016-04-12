'use strict';

const actions = require('./actions');
const Hand = require('./hand');

class DealerHand extends Hand {

  constructor (cards, s17) {
    super(cards, null);

    this.s17 = s17;
  }

  hasS17Rule () {
    return this.s17 === true;
  }

  hasSoft17OrLower () {
    return this
      .getCombinations(
        this
          .cards
          .map(card => card.getValues())
      )
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
      .getCombinations(
        this
          .cards
          .map(card => card.getValues())
      )
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
    } else {
      nextActions.push(actions.STAND);
    }

    return nextActions;
  }

  serializeForPlayers () {
    return {
      state: this.state,
      bet: this.bet,
      cards: [
        this.cards[0]
      ]
        // .cards
        // .map(
        //   card => card.serializeForPlayers()
        // )
    };
  }

}

module.exports = DealerHand;
