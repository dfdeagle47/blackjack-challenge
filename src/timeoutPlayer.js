function timeoutPlayer (player) {
  return {
    name: player.name,
    onGameStart (state, makeBet) {
      var timeout = setTimeout(() => {
        makeBet(null);
      });
      player.onGameStart(state, bet => {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
          makeBet(bet);
        }
      });
    },
    onGameTurn (state, makeMove) {
      var timeout = setTimeout(() => {
        makeMove(null);
      });
      player.onGameStart(state, bet => {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
          makeMove(bet);
        }
      });
    },
    onGameEnd: player.onGameEnd
  };
}

module.exports = timeoutPlayer;
