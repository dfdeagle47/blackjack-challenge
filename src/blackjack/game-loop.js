'use strict';

const Promise = require('bluebird');
const actions = require('./actions');
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

  join (player) {
    if (this.started === true) {
      return new Error('Game already started');
    }

    this.table.addPlayer(player);
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
      .then(
        () => {
          if (this.table.checksumTable() !== true) {
            console.log(
              require('util').inspect(
                this
                  .table
                  .serializeForPlayers(
                    null,
                    null,
                    null,
                    false
                  ),
                {
                  colors: true,
                  depth: 100
                }
              )
            );
          } else {
            return null;
          }
        }
      )
      .then(
        () => {
          if (this.table.deck.cardCount() > this.table.deck.numDecks * 52 * 0.5) {
            this.table.deck.generateAndShuffle();
          }
        }
      )
      .catch(e => {
        console.log(e, e.stack);
        process.exit(1);
      });
  }

  triggerGameStart () {
    this.started = false;

    return Promise
      .mapSeries(
        this
          .table
          .players,
        player => {
          return player
            .triggerGameStart(
              this
                .table
                .serializeForPlayers()
            )
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
          return this.triggerPlayerActions(playerIndex, 0);
        }
      );
  }

  triggerPlayerActions (playerIndex, handIndex) {
    const player = this
      .table
      .getPlayerByIndex(
        playerIndex
      );

    if (handIndex === player.handCount()) {
      return null;
    }

    return this
      .triggerHandActions(
        playerIndex,
        handIndex
      )
      .then(() => {
        return this.triggerPlayerActions(
          playerIndex,
          handIndex + 1
        );
      });
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

    if (hand.getState() === states.STAND) {
      return null;
    }

    return player
      .triggerHandActions(
        this
          .table
          .serializeForPlayers(
            playerIndex,
            handIndex,
            nextActions
          )
      )
      .then(chosenAction => {
        // Note: Nice try!
        if (nextActions.indexOf(chosenAction) === -1) {
          chosenAction = actions.STAND;
        }

        this.table.doAction(
          player,
          hand,
          chosenAction
        );

        return this.triggerHandActions(
          playerIndex,
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
        player => {
          return player
            .triggerGameEnd(
              this
                .table
                .serializeForPlayers(
                  null,
                  null,
                  null,
                  true
                )
            )
            .then(
              () => {
                return player.removeHands();
              }
            );
        }
      );
  }

}

module.exports = GameLoop;
