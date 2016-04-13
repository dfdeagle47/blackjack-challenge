var scoreboard = require('./scoreboard');
var network = require('./network');
var cliClear = require('cli-clear');

var myScoreboard = scoreboard();

[
  'http://localhost:3000'
].forEach(endpoint => {
  var player = myScoreboard.getSpectator();
  network.createClient(endpoint).join(player, { spectator: true });
});

function renderScreen () {
  cliClear();
  console.log(myScoreboard.render());
}

myScoreboard.on('update', () => {
  renderScreen();
});

renderScreen();
