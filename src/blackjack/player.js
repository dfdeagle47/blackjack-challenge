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

}

exports default Player;
