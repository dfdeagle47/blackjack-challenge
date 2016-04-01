'use strict';

import Table from './table';

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

  resetGame () {
    this.playerIndex = 0;
    this.handIndex = 0;
  }

  next () {
    if (this.playerIndex === this.table.playerCount()) {
      this.resetGame();
    }

    let player = this.getPlayerByIndex(
      this.playerIndex
    );

    if (this.handIndex === this.player.handCount()) {
      player = this.getPlayerByIndex(
        this.playerIndex + 1
      );

      this.handIndex = 0;
    }

    const hand = this.getHandByIndex(
      this.handIndex
    );

    const nextActions = hand.getNextActions();

    return player
      .askPlayer(nextActions)
      .then(chosenAction => {
        // Note: Nice try!
        if (nextActions.indexOf(chosenAction) === -1) {
          throw new Error('Invalid action');
        }
        else {
          table.doAction(
            player,
            hand,
            chosenAction
          );
        }

        this.playerIndex += 1;
        this.handIndex += 1;

        return next();
      })
      .catch(e => {
        player.removeHandByIndex(
          this.handIndex
        );

        return next();
      });
  }

}

exports default GameLoop;
