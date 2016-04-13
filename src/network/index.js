'use strict';

var querystring = require('querystring');

function createServer (httpServer, casino) {
  var io = require('socket.io')(httpServer);

  io.on('connection', socket => {
    var query = socket.handshake.query;
    var name = query.name;
    var spectator = JSON.parse(query.spectator);
    var game = casino.join({
      name: name,
      onGameStart (state, makeBet) {
        socket.emit('onGameStart', [ state ], makeBet);
      },
      onGameTurn (state, makeMove) {
        socket.emit('onGameTurn', [ state ], makeMove);
      },
      onGameEnd (state) {
        socket.emit('onGameEnd', [ state ]);
      }
    }, {
      spectator: spectator
    });

    socket.on('quit', () => socket.disconnect());
    socket.on('disconnect', () => game.quit());
  });
}

function createClient (endpoint) {
  return {
    join (player, extra) {
      extra = extra || {};
      var io = require('socket.io-client');
      var connectQuery = querystring.stringify({
        name: player.name,
        spectator: JSON.stringify(!!extra.spectator)
      });
      var socket = io(endpoint, { query: connectQuery });

      socket.on('onGameStart', (data, respond) => player.onGameStart(data[0], respond));
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
