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

  has18OrHigher () {
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
            ) >= 18
        );
      })
      .length !== 0;
  }

  hasSoft17 () {
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
            ) === 17 &&
          combination.indexOf(11) !== -1
        );
      })
      .length !== 0;
  }

  hasHard17 () {
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
            ) === 17 &&
          combination.indexOf(11) === -1
        );
      })
      .length !== 0;
  }

  getNextActions () {
    const nextActions = [];

    if (
      this.has18OrHigher() ||
      this.hasHard17() ||
      (
        this.hasSoft17() &&
        !this.hasS17Rule()
      )
    ) {
      nextActions.push(actions.STAND);
    } else {
      nextActions.push(actions.HIT);
    }

    return nextActions;
  }

  serializeForPlayers () {
    return {
      state: this.state,
      bet: this.bet,
      cards: [
        this
          .cards[0]
          .serializeForPlayers()
      ]
        // .cards
        // .map(
        //   card => card.serializeForPlayers()
        // )
    };
  }

}

module.exports = DealerHand;
