'use strict';

const Promise = require('bluebird');
const states = require('./states');
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
    this.started = true;

    return this
      .triggerGameStart()
      .then(
        () => this.triggerPlayersActions()
      )
      .then(
        () => this.compareHands()
      )
      .then(
        () => this.triggerGameEnd()
      )
      .then(
        () => {
          this.started = false;
        }
      )
      .catch(e => console.log(e, e.stack));
  }

  triggerGameStart () {
    this.started = false;

    return Promise
      .map(
        this
          .table
          .players,
        player => {
          return player
            .triggerGameStart()
            .then(bet => {
              this
                .table
                .doDealFirstHand(
                  player,
                  bet
                );
            });
        }
      );
  }

  triggerPlayersActions () {
    return Promise
      .each(
        Array.from(
          new Array(
            this
              .table
              .playerCount()
          )
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
          new Array(
            this
              .table
              .getPlayerByIndex(
                playerIndex
              )
              .handCount()
          )
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
      handIndex
    );

    const nextActions = hand.getNextActions();

    console.log(
      require('util').inspect(
        this
          .table
          .serializeForPlayers(playerIndex, handIndex, nextActions),
        {
          colors: true,
          depth: 100
        }
      )
    );

    if (hand.getState() === states.STAND) {
      return null;
    }

    return player
      .triggerHandActions(
        nextActions
      )
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

        this.triggerHandActions(
          playerIndex,
          handIndex
        );
      })
      .catch(e => {
        player.removeHandByIndex(
          handIndex
        );
      });
  }

  compareHands () {
    const dealer = this.table.getDealer();
    const dealerHand = dealer.getHandByIndex(0);

    this
      .table
      .getPlayers()
      .forEach(
        player => {
          player
            .getHands()
            .forEach(
              hand => {
                this
                  .table
                  .doCompareHands(
                    dealer,
                    dealerHand,
                    player,
                    hand
                  );
              }
            );
        }
      );
  }

  triggerGameEnd () {
    return Promise
      .map(
        this
          .table
          .players,
        player => player.triggerGameEnd
      );
  }

  serializeState (dealer, dealerHand, player, playerHand) {
    return {
      players: this
        .getPlayers()
        .map(
          player => player
            .getHands()
            .map(
              hand => {
                return hand
                  .map(
                    card => {
                      return {
                        suit: card.getSuit(),
                        rank: card.getRank()
                      };
                    }
                  );
              }
            )
        )
    };
  }

}

module.exports = GameLoop;
