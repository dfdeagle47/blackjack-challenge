'use strict';

const Table = require('./table');

class GameLoop {

  constructor (s17, numDecks, dealerBankroll, playerBankroll) {
    this.table = new Table(
      s17,
      numDecks,
      dealerBankroll,
      playerBankroll
    );

    this.playerIndex = 0;
    this.handIndex = 0;
  }

  join (ipAddress) {
    this.table.addPlayer(ipAddress);
  }

  reset () {
    this.playerIndex = 0;
    this.handIndex = 0;
  }

  next () {
    if (this.playerIndex === this.table.playerCount()) {
      return this.reset();
    }

    let player = this
      .table
      .getPlayerByIndex(
        this.playerIndex
      );

    if (player.handCount() === 0) {
      this
        .table
        .doDealFirstHand(player);
    }

    if (this.handIndex === player.handCount()) {
      player = this
        .table
        .getPlayerByIndex(
          this.playerIndex + 1
        );

      this.handIndex = 0;
    }

    const hand = player.getHandByIndex(
      this.handIndex
    );

    const nextActions = hand.getNextActions();

    return player
      .askPlayer(nextActions)
      .then(chosenAction => {
        // Note: Nice try!
        if (nextActions.indexOf(chosenAction) === -1) {
          throw new Error('Invalid action');
        } else {
          this.table.doAction(
            player,
            hand,
            chosenAction
          );
        }

        this.playerIndex += 1;
        this.handIndex += 1;

        return this.next();
      })
      .catch(e => {
        player.removeHandByIndex(
          this.handIndex
        );

        return this.next();
      });
  }

}

module.exports = GameLoop;
