'use strict';

const Player = require('./player');

class DealerPlayer extends Player {

  constructor (bankdroll) {
    super('DEALER', bankdroll);
  }

  triggerGameStart () {
    return Promise.resolve(null);
  }

  triggerHandActions (state) {
    return Promise.resolve(state.moves[0]);
  }

  triggerGameEnd () {
    return Promise.resolve(null);
  }

}

module.exports = DealerPlayer;
