'use strict';

import Player from './player';
import Hand from './hand';
import Deck from './deck';

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
      .filter(player => player.ipAddress === ipAddress)
      [0];
  }

  playerCount () {
    return this.players.length;
  }

  addPlayer (player) {
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

  doHit (player, hand, action) {
    const card = this.deck.pop();

    hand.addCard(card);
  }

  doStand (player, hand) {}

  doDoubleDown (player, hand) {
    hand.setHasDoubledDown(true);

    hand.setBet(
      hand.getBet() * 2
    );

    this.doHit(player, hand);
  }

  doSplit (player, hand) {
    const secondCard = hand.popCard();

    let newHand = new Hand(
      [secondCard],
      hand.getBet()
    );

    player.add(newHand);

    this.doHit(player, hand);
    this.doHit(player, newHand);
  }

}

exports default Table;
