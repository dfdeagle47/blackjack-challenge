'use strict';

const Player = require('./player');
const Hand = require('./hand');
const Deck = require('./deck');

class Table {

  constructor (s17, numDecks, dealerBankroll, playerBankroll) {
    this.s17 = s17;
    this.deck = new Deck(numDecks);
    this.dealerBankroll = dealerBankroll;
    this.playerBankroll = playerBankroll;

    this.players = [];

    this.playerIndex = 0;
    this.handIndex = 0;
  }

  getPlayerByIndex (index) {
    return this.players[index];
  }

  getPlayerByIpAddress (ipAddress) {
    return this
      .players
      .filter(player => player.ipAddress === ipAddress)[0];
  }

  playerCount () {
    return this.players.length;
  }

  addPlayer (ipAddress) {
    const player = new Player(ipAddress, this.playerBankroll);
    return (this.players.unshift(player), player);
  }

  doAction (player, hand, action) {
    switch (action) {
      case action.HIT:
        this.doHit(player, hand);
        break;
      case action.STAND:
        this.doStand(player, hand);
        break;
      case action.DOUBLE_DOWN:
        this.doDoubleDown(player, hand);
        break;
      case action.SPLIT:
        this.doSplit(player, hand);
        break;
    }
  }

  doDealFirstHand (player, bet) {
    const card1 = this.deck.popCard();
    const card2 = this.deck.popCard();

    player.subtractFromBankroll(bet);

    const hand = new Hand(
      [
        card1,
        card2
      ],
      bet
    );

    player.addHand(hand);
  }

  doHit (player, hand) {
    const card = this.deck.popCard();

    hand.addCard(card);
  }

  doStand (player, hand) {}

  doDoubleDown (player, hand) {
    hand.setHasDoubledDown(true);

    player.subtractFromBankroll(
      hand.getBet()
    );

    hand.addToBet(
      hand.getBet()
    );

    this.doHit(player, hand);
  }

  doSplit (player, hand) {
    const secondCard = hand.popCard();

    player.subtractFromBankroll(
      hand.getBet()
    );

    let newHand = new Hand(
      [secondCard],
      hand.getBet()
    );

    player.add(newHand);

    this.doHit(player, hand);
    this.doHit(player, newHand);
  }

}

module.exports = Table;
