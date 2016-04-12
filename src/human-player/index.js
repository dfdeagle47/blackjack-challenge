var inquirer = require('inquirer');
var chalk = require('chalk');
var cliClear = require('cli-clear');

var identity = x => x;

function hRule (str) {
  var columns = process.stdout.columns || 80;
  var rule = '';
  while (rule.length < columns) {
    rule += str || '─';
  }
  return rule.substr(0, columns);
}

function renderActive (isActive) {
  return isActive ? chalk.cyan('❯') : ' ';
}

function renderCard (card) {
  var color = { hearts: chalk.red, diamonds: chalk.red }[card.suit] || identity;
  var symbol = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' }[card.suit];
  var rank = { '1': 'A', '11': 'J', '12': 'Q', '13': 'K' }[card.rank] || String(card.rank);
  return color(`${symbol}${rank}`);
}

function renderHand (hand, isActive) {
  var bet = hand.bet || 0;
  var cards = hand.cards || [];
  var statePresentation = {
    'lost': chalk.dim
  }[hand.state] || identity;
  var prefix = hand.state === 'win' ? chalk.green('✓') : renderActive(isActive);
  return statePresentation(`${prefix} ${renderMoney(bet)} ${cards.map(renderCard).join(' ')}`);
}

function renderMoney (amount) {
  return chalk.yellow(`[\$${amount}]`);
}

function renderPlayer (player, isActive, handIndex) {
  var name = player.name || 'unknown player';
  var bankroll = player.bankroll || 0;
  var hands = player.hands || [];
  return [
    `${renderActive(isActive)} ${name} (${renderMoney(bankroll)}):`,
    hands.map((hand, index) => {
      var isActiveHand = isActive && (index === handIndex);
      return `  ${renderHand(hand, isActiveHand)}`;
    }).join('\n')
  ].join('\n');
}

function renderPlayers (players, playerIndex, handIndex) {
  return players.map((player, index) => {
    return renderPlayer(player, index === playerIndex, handIndex);
  }).join('\n\n');
}

function renderState (state) {
  state = state || {};
  var players = state.players || [];
  return renderPlayers(players, state.playerIndex, state.handIndex);
}

module.exports = (name, options) => {
  options = Object.assign({
    clearScreen: false
  }, options);

  var prompt = null;
  function clearScreen () {
    if (prompt) {
      prompt.ui.close();
      prompt = null;
      console.log('');
    }

    if (options.clearScreen) {
      cliClear();
    } else {
      console.log(hRule());
    }
  }

  function onGameStart (state, makeBet) {
    clearScreen();
    prompt = inquirer.prompt([{
      type: 'input',
      name: 'amount',
      message: 'Place your bet $',
      default: 0,
      filter: Number
    }]);
    prompt.then(result => {
      prompt = null;
      makeBet(result);
    });
  }

  function onGameTurn (state, makeMove) {
    clearScreen();
    console.log(renderState(state));

    var moves = state.moves;
    if (moves.length > 0) {
      console.log('');
      prompt = inquirer.prompt([{
        type: 'list',
        name: 'move',
        message: 'Make your move',
        choices: moves
      }]);
      prompt.then(result => {
        prompt = null;
        makeMove(result);
      });
    }
  }

  function onGameEnd (state, makeMove) {
    clearScreen();
    console.log(renderState(state));
  }

  return {
    name: name,
    onGameStart,
    onGameTurn,
    onGameEnd
  };
};
