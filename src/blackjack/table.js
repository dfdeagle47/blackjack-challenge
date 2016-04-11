'use strict';

const actions = require('./actions');
const states = require('./states');
const DealerPlayer = require('./dealer-player');
const Player = require('./player');
const DealerHand = require('./dealer-hand');
const Hand = require('./hand');
const Deck = require('./deck');

class Table {

  constructor (s17, numDecks, dealerBankroll, playerBankroll) {
    this.s17 = s17;
    this.deck = new Deck(numDecks);
    this.dealerBankroll = dealerBankroll;
    this.playerBankroll = playerBankroll;

    this.dealer = new DealerPlayer(this.dealerBankroll, true);
    this.players = [
      this.dealer
    ];

    this.playerIndex = 0;
    this.handIndex = 0;
  }

  getPlayers () {
    return this.players.slice(0, -1);
  }

  getDealer () {
    return this.players[this.players.length - 1];
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
      case actions.HIT:
        this.doHit(player, hand);
        break;
      case actions.STAND:
        this.doStand(player, hand);
        break;
      case actions.DOUBLE_DOWN:
        this.doDoubleDown(player, hand);
        break;
      case actions.SPLIT:
        this.doSplit(player, hand);
        break;
      default:
        throw new Error('Unknown action ' + action);
    }
  }

  doDealFirstHand (player, bet) {
    const card1 = this.deck.popCard();
    const card2 = this.deck.popCard();

    let hand = null;

    if (player instanceof DealerPlayer) {
      hand = new DealerHand(
        [
          card1,
          card2
        ],
        this.s17
      );
    } else {
      player.subtractFromBankroll(bet);

      hand = new Hand(
        [
          card1,
          card2
        ],
        bet
      );
    }

    player.addHand(hand);
  }

  doHit (player, hand) {
    const card = this.deck.popCard();

    hand.addCard(card);
  }

  doStand (player, hand) {
    hand.setState(states.STAND);
  }

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

  doCompareHands (dealer, dealerHand, player, playerHand) {
    const playerHandTotal = playerHand.getBestTotal();
    const dealerHandTotal = dealerHand.getBestTotal();

    console.log('..1', this.deck.cardCount());
    // console.log('playerHand=', playerHand);
    // console.log('playerHandTotal=', playerHandTotal);
    // console.log('dealerHandTotal=', dealerHandTotal);

    if (playerHand.hasNaturalBlackjack()) {
      console.log('..2');
      playerHand.setState(
          states.WIN
      );
      player.addToBankroll(
        playerHand.getBet() * 2.5
      );
      dealer.addToBankroll(
        -1 * playerHand.getBet() * 1.5
      );
    } else if (dealerHand.hasNaturalBlackjack()) {
      console.log('..3');
      playerHand.setState(
          states.LOSE
      );
      dealer.addToBankroll(
        playerHand.getBet()
      );
    } else if (dealerHand.hasBust()) {
      console.log('..4');
      playerHand.setState(
          states.WIN
      );
      player.addToBankroll(
        playerHand.getBet() * 2
      );
      dealer.addToBankroll(
        -1 * playerHand.getBet()
      );
    } else if (playerHand.hasBust()) {
      console.log('..5');
      playerHand.setState(
          states.LOSE
      );
      dealer.addToBankroll(
        playerHand.getBet()
      );
    } else if (playerHandTotal > dealerHandTotal) {
      console.log('..6');
      playerHand.setState(
          states.WIN
      );
      player.addToBankroll(
        playerHand.getBet() * 2
      );
      dealer.addToBankroll(
        -1 * playerHand.getBet()
      );
    } else if (playerHandTotal === dealerHandTotal) {
      console.log('..7');
      playerHand.setState(
          states.DRAW
      );
      player.addToBankroll(
        playerHand.getBet()
      );
    } else if (playerHandTotal < dealerHandTotal) {
      console.log('..8');
      playerHand.setState(
          states.LOSE
      );
      dealer.addToBankroll(
        playerHand.getBet()
      );
    }
  }

  serializeForPlayers (playerIndex, handIndex, nextActions) {
    return {
      dealer: this
        .getDealer()
        .serializeForPlayers(),
      players: this
        .getPlayers()
        .map(
          player => player.serializeForPlayers()
        ),
      playerIndex: playerIndex,
      handIndex: handIndex,
      moves: nextActions
    };
  }

  checksumTable () {
    return (
      this
      .getPlayers()
      .reduce(
        (bankrollSum, player) => {
          return bankrollSum + player.getBankroll();
        },
        0
      ) +
      this
        .getDealer()
        .getBankroll()
    ) === (
      (this.playerCount() - 1) * this.playerBankroll +
      this.dealerBankroll
    );
  }

}

module.exports = Table;
