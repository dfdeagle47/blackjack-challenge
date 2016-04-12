'use strict';

class Player {

  constructor (name, bankroll) {
    this.name = name;
    this.bankroll = bankroll;

    this.dealer = false;

    this.hands = [];
  }

  getHands () {
    return this.hands;
  }

  addHand (hand) {
    return (this.hands.push(hand), hand);
  }

  removeHands () {
    return (this.hands = [], this.hands);
  }

  getHandByIndex (index) {
    return this.hands[index];
  }

  handCount () {
    return this.hands.length;
  }

  getBankroll () {
    return this.bankroll;
  }

  addToBankroll (bet) {
    return (this.bankroll += bet);
  }

  subtractFromBankroll (bet) {
    return (this.bankroll -= bet);
  }

  triggerGameStart () {
    return Promise.resolve(50);
  }

  triggerHandActions (state) {
    return Promise.resolve(state.moves[0]);
    // return Promise.resolve(require('underscore').sample(state.moves));
  }

  triggerGameEnd () {
    return Promise.resolve(null);
  }

  serializeForPlayers () {
    return {
      name: this.name,
      dealer: this.dealer,
      bankroll: this.bankroll,
      hands: this
        .hands
        .map(
          hand => hand.serializeForPlayers()
        )
    };
  }

}

module.exports = Player;
