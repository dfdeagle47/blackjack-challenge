'use strict';

class Player {

  constructor (ipAddress, bankroll) {
    this.ipAddress = ipAddress;
    this.bankroll = bankroll;

    this.hands = [];
  }

  addHand (hand) {
    return (this.hands.push(hand), hand);
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

  addToBankroll (bet) {
    return (this.bankroll += bet);
  }

  subtractFromBankroll (bet) {
    return (this.bankroll -= bet);
  }

  triggerGameStart () {
    throw new Error('START');
  }

  triggerHandActions (actions) {
    console.log('ASK_PLAYER');
    console.log('actions=', actions);

    return Promise.resolve('HIT');
  }

  triggerGameEnd () {
    throw new Error('END');
  }

}

module.exports = Player;
