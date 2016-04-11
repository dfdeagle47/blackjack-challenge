'use strict';

const Player = require('./player');

class DealerPlayer extends Player {

  constructor (bankdroll) {
    super('DEALER', bankdroll);
  }

  triggerGameStart () {
    return Promise.resolve(null);
  }

  triggerHandActions (actions) {
    return Promise.resolve(actions[0]);
  }

  triggerGameEnd () {
    return Promise.resolve(null);
  }

}

module.exports = DealerPlayer;
