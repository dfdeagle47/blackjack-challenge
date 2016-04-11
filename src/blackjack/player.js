'use strict';

class Player {

  constructor (ipAddress, bankroll) {
    this.ipAddress = ipAddress;
    this.bankroll = bankroll;

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

  removeHandByIndex (index) {
    return this.hands.splice(index, 1);
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
  }

  triggerGameEnd () {
    return Promise.resolve(null);
  }

  serializeForPlayers () {
    return {
      ipAddress: this.ipAddress,
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
