'use strict';

const Player = require('./player');

class Dealer extends Player {

  constructor (ipAddress, bankroll) {
    super(ipAddress, bankroll);
  }

}

module.exports = Dealer;
