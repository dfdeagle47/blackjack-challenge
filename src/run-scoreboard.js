var scoreboard = require('./scoreboard');
var network = require('./network');
var cliClear = require('cli-clear');

var myScoreboard = scoreboard();

[
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:3004',
  'http://localhost:3005'
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
