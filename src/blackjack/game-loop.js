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
  }

  join (ipAddress) {
    if (this.started === true) {
      return new Error('Game already started');
    }

    this.table.addPlayer(ipAddress);
  }

  start () {
    this.playerIndex = 0;
    this.handIndex = 0;
    this.started = false;

    return Promise.resolve()
      .triggerGameStart()
      .then(
        () => {
          
        }
      )
      .then(
        () => this.triggerGameEnd()
      );
  }

  triggerGameStart () {
    this.started = false;

    return Promise
      .all(
        this
          .table
          .players
          .map(
            player => player.triggerGameStart()
          )
      );
  }

  triggerPlayersActions () {
    return Promise
      .each(
        Array.from(
          this
            .table
            .playerCount()
            .keys()
          ),
        (playerIndex) => {
          return this.triggerPlayerActions(playerIndex);
        }
      );
  }

  triggerPlayerActions (playerIndex) {
    return Promise
      .each(
        /**
         * This introduces a bug where splitting won't work because then the number
         * of hands evolves during the game.
         * Also, removing hands on invalid actions will break this as well.
         * Just doing a while loop around pending hands a restart at 0 should wokr.
         */
        Array.from(
          this
            .table
            .getPlayerByIndex(
              playerIndex
            )
            .handCount()
            .keys()
          ),
        (handIndex) => {
          return this.triggerHandActions(playerIndex, handIndex);
        }
      );
  }

  triggerHandActions (playerIndex, handIndex) {
    const player = this
      .table
      .getPlayerByIndex(
        playerIndex
      );

    const hand = player.getHandByIndex(
      this.handIndex
    );

    const nextActions = hand.getNextActions();

    return player
      .askPlayer(
        nextActions
      )
      .then(chosenAction => {
        console.log('++5');
        // Note: Nice try!
        if (nextActions.indexOf(chosenAction) === -1) {
          console.log('++6');
          throw new Error('Invalid action');
        } else {
          console.log('++7');
          this.table.doAction(
            player,
            hand,
            chosenAction
          );
        }

        console.log('++8', player.hands[0]);

        if (hand.status === 'pending') {
          return this.triggerHandActions(
            playerIndex,
            handIndex
          );
        }
      })
      .catch(e => {
        console.log('++9');
        player.removeHandByIndex(
          this.handIndex
        );
      });
  }

  triggerGameEnd () {
    this.started = false;

    return Promise
      .all(
        this
          .table
          .players
          .map(
            player => player.triggerGameEnd()
          )
      );
  }

}

module.exports = GameLoop;
