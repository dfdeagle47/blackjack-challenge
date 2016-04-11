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
    console.log('PLAYER_START');
    return Promise.resolve(50);
  }

  triggerHandActions (actions) {
    console.log('ASK_PLAYER');
    console.log('actions=', actions);

    return Promise.resolve(actions[0]);
  }

  triggerGameEnd () {
    console.log('PLAYER_END');
    return Promise.resolve();
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
