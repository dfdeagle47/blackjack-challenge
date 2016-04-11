'use strict';

var querystring = require('querystring');

function createServer (httpServer, casino) {
  var io = require('socket.io')(httpServer);

  io.on('connection', socket => {
    var query = socket.handshake.query;
    var game = casino.join({
      name: query.name,
      onGameStart (makeBet) {
        socket.emit('onGameStart', [], makeBet);
      },
      onGameTurn (state, makeMove) {
        socket.emit('onGameTurn', [ state ], makeMove);
      },
      onGameEnd (state) {
        socket.emit('onGameEnd', [ state ]);
      }
    });

    socket.on('quit', () => socket.disconnect());
    socket.on('disconnect', () => game.quit());
  });
}

function createClient (endpoint) {
  return {
    join (player) {
      var io = require('socket.io-client');
      var connectQuery = querystring.stringify({
        name: player.name
      });
      var socket = io(endpoint, { query: connectQuery });

      socket.on('onGameStart', (data, respond) => player.onGameStart(respond));
      socket.on('onGameTurn', (data, respond) => player.onGameTurn(data[0], respond));
      socket.on('onGameEnd', (data) => player.onGameEnd(data[0]));

      return {
        quit () {
          socket.emit('quit');
        }
      };
    }
  };
}

module.exports = {
  createServer,
  createClient
};
