'use strict';

const Promise = require('bluebird');
const actions = require('./actions');
const states = require('./states');
const Table = require('./table');

class GameLoop {

  constructor (s17, numDecks, dealerBankroll, playerBankroll, gameInterval) {
    this.table = new Table(
      s17,
      numDecks,
      dealerBankroll,
      playerBankroll
    );
    this.gameInterval = gameInterval;

    this.queuedPlayers = [];
  }

  join (playerConfig, extras) {
    const name = playerConfig.name;

    this
      .queuedPlayers
      .push([
        playerConfig,
        extras
      ]);

    return {
      quit: this
        .quit
        .bind(
          this,
          name
        )
    };
  }

  swap () {
    this
      .queuedPlayers
      .forEach(
        (queuedPlayer) => {
          this
            .table
            .removePlayerByName(
              queuedPlayer[0].name
            );

          this
            .table
            .addPlayer
            .apply(this.table, queuedPlayer);
        }
      );

    this.queuedPlayers = [];
  }

  quit (name) {
    this
      .table
      .removePlayerByName(name);

    this.queuedPlayers = this
      .queuedPlayers
      .filter(
        queuedPlayer => queuedPlayer.name !== name
      );
  }

  startLoop () {
    return this
      .start()
      .catch(e => {
        console.error('ERROR=', e, e.stack);
      })
      .then(() => {
        return new Promise((resolve, reject) => {
          setTimeout(
            () => {
              resolve(
                this.startLoop()
              );
            },
            this.gameInterval
          );
        });
      });
  }

  start () {
    this.swap();

    const playerCount = this
      .table
      .playerCount({
        spectators: false,
        dealer: false
      });

    if (playerCount === 0) {
      return Promise.resolve(null);
    }

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
          if (this.table.deck.shouldShuffle()) {
            this.table.deck.shuffle();
          }
        }
      );
  }

  triggerGameStart () {
    return Promise
      .mapSeries(
        this
          .table
          .getPlayers({
            spectators: true,
            dealer: true
          }),
        player => {
          return player
            .triggerGameStart(
              this
                .table
                .serializeForPlayers()
            )
            .then(bet => {
              // Note: Nice try!
              if (!player.isDealer() && !player.canBetAmount(bet)) {
                throw new Error('Error: ' + player.name + ' tried to bet an invalid amount `' + bet + '`');
              }

              if (player.isSpectator() === false) {
                this
                  .table
                  .doDealFirstHand(
                    player,
                    bet
                  );
              }
            })
            .catch((e) => {
              console.error('START_ERROR=', e, e.stack);
              this.removePlayerByName(player.name);
            });
        }
      );
  }

  triggerPlayersActions () {
    return Promise
      .each(
        this
          .table
          .getPlayers({
            spectators: false,
            dealer: true
          }),
        (player) => {
          return this.triggerPlayerActions(player, 0);
        }
      );
  }

  triggerPlayerActions (player, handIndex) {
    const playerIndex = this
      .table
      .getPlayerIndexByName(
        player.name
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
          player,
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
      return Promise.resolve(null);
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
          throw new Error('Error: ' + player.name + ' tried to do an invalid action `' + chosenAction + '`');
        }

        if (
          (
            chosenAction === actions.DOUBLE_DOWN ||
            chosenAction === actions.SPLIT
          ) &&
          !player.canBetAmount(hand.getBet())
        ) {
          throw new Error('Error: ' + player.name + ' doesn’t have enough money to do action `' + chosenAction + '`');
        }

        if (player.isSpectator() === false) {
          this.table.doAction(
            player,
            hand,
            chosenAction
          );

          return this.triggerHandActions(
            playerIndex,
            handIndex
          );
        }
      })
      .catch((e) => {
        console.error('ACTION_ERROR=', e, e.stack);
        this.removePlayerByName(player.name);
      });
  }

  compareHands () {
    const dealer = this.table.getDealer();
    const dealerHand = dealer.getHandByIndex(0);

    this
      .table
      .getPlayers({
        spectators: false,
        dealer: false
      })
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
          .getPlayers({
            spectators: true,
            dealer: true
          }),
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
