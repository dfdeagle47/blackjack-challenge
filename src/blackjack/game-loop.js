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

    console.log('[JOIN] Player', name, 'joined');

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
    console.log('[JOIN] Player', name, 'quit');

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
    console.log('PRE_SWAP');
    console.log('player_count=', this.table.playerCount({ spectators: false, dealer: false }));
    console.log('queued_player_count=', this.queuedPlayers.length);

    this.swap();

    console.log('POST_SWAP');
    console.log('player_count=', this.table.playerCount({ spectators: false, dealer: false }));
    console.log('queued_player_count=', this.queuedPlayers.length);

    const playerCount = this
      .table
      .playerCount({
        spectators: false,
        dealer: false
      });

    if (playerCount === 0) {
      return Promise.resolve(null);
    }

    console.log('[START] New game started');

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
              'CHECKSUM_ERROR=',
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
    console.log('[GAME_START_TRIGGER] Game start trigger');

    return Promise
      .mapSeries(
        this
          .table
          .getPlayers({
            spectators: true,
            dealer: true
          }),
        player => {
          console.log('[GAME_START_TRIGGER] Game start trigger triggered for', player.name);

          return player
            .triggerGameStart(
              this
                .table
                .serializeForPlayers()
            )
            .then(bet => {
              if (player.isSpectator()) {
                return null;
              }

              // Note: Nice try!
              if (
                !player.isDealer() &&
                !player.canBetAmount(bet)
              ) {
                throw new Error('Error: ' + player.name + ' tried to bet an invalid amount `' + bet + '`');
              }

              console.log('[GAME_START_TRIGGER] Player', player.name, 'bet', bet);

              this
                .table
                .doDealFirstHand(
                  player,
                  bet
                );
            })
            .catch((e) => {
              console.error('START_ERROR=', e, e.stack);
              this.table.makePlayerSpectatorByName(player.name);
            });
        }
      );
  }

  triggerPlayersActions () {
    console.log('[PLAYERS_ACTIONS_TRIGGER] Players actions trigger');

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
    console.log('[PLAYER_ACTIONS_TRIGGER] Players actions trigger for', player.name);

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

    console.log('[HAND_ACTIONS_TRIGGER] Players actions trigger for', player.name, 'and hand', handIndex);

    const hand = player.getHandByIndex(
      handIndex
    );

    let nextActions = hand.getNextActions();

    if (!player.canBetAmount(hand.getBet())) {
      nextActions = nextActions
        .filter(
          nextAction => (
            nextAction !== actions.DOUBLE_DOWN &&
            nextAction !== actions.SPLIT
          )
        );
    }

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
        if (player.isSpectator()) {
          return null;
        }

        // Note: Nice try!
        if (nextActions.indexOf(chosenAction) === -1) {
          chosenAction = actions.STAND;
        }

        console.log('[HAND_ACTIONS_TRIGGER] Player', player.name, 'chose to do action', chosenAction);

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
    console.log('[GAME_START_TRIGGER] Game end trigger');

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
