'use strict';

const Promise = require('bluebird');

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

  setSpectator (spectator) {
    return (this.spectator = spectator);
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

  canBetAmount (bet) {
    if (
      typeof bet !== 'number' ||
      isNaN(bet) ||
      bet <= 0 ||
      bet > this.getBankroll()
    ) {
      return false;
    }

    return true;
  }

  subtractFromBankroll (bet) {
    return (this.bankroll -= bet);
  }

  triggerGameStart (state) {
    if (this.isSpectator()) {
      this.onGameStart(state, (bet) => {});
      return Promise.resolve(null);
    } else {
      return new Promise((resolve, reject) => {
        this.onGameStart(state, (bet) => {
          resolve((bet || {}).amount);
        });
      })
      .timeout(10 * 1000);
    }
  }

  triggerHandActions (state) {
    return new Promise((resolve, reject) => {
      this.onGameTurn(state, (action) => {
        resolve((action || {}).move);
      });
    })
    .timeout(10 * 1000);
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
