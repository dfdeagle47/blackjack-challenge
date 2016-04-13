'use strict';

class Player {

  constructor (playerConfig, extras) {
    this.name = playerConfig.name;

    this.onGameStart = playerConfig.onGameStart;
    this.onGameTurn = playerConfig.onGameTurn;
    this.onGameEnd = playerConfig.onGameEnd;

    this.bankroll = extras.bankroll;
    this.spectator = !!extras.spectator;
    this.dealer = !!extras.dealer;

    this.hands = [];
  }

  getName () {
    return this.name;
  }

  isDealer () {
    return this.dealer === true;
  }

  isSpectator () {
    return this.spectator === true;
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

  triggerGameStart (state) {
    return new Promise((resolve, reject) => {
      this.onGameStart(state, function (bet) {
        resolve(bet.amount);
      });
    });
  }

  triggerHandActions (state) {
    return new Promise((resolve, reject) => {
      this.onGameTurn(state, function (action) {
        resolve(action.move);
      });
    });
  }

  triggerGameEnd (state) {
    this.onGameEnd(state);
    return Promise.resolve(null);
  }

  serializeForPlayers (isEnd) {
    return {
      name: this.name,
      dealer: this.isDealer(),
      spectator: this.isSpectator(),
      bankroll: this.bankroll,
      hands: this
        .hands
        .map(
          hand => hand.serializeForPlayers(isEnd)
        )
    };
  }

}

module.exports = Player;
