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
    'LOSE': chalk.dim
  }[hand.state] || identity;

  var prefix;
  switch (hand.state) {
    case 'WIN':
      prefix = chalk.green('✓');
      break;
    case 'DRAW':
      prefix = chalk.green('=');
      break;
    default:
      prefix = renderActive(isActive);
  }

  return statePresentation(`${prefix} ${renderMoney(bet)} ${cards.map(renderCard).join(' ')}`);
}

function renderMoney (amount) {
  return chalk.yellow(`[\$${amount}]`);
}

function renderPlayer (player, isActive, handIndex) {
  var name = player.name || 'unknown player';
  var bankroll = player.bankroll || 0;
  var hands = player.hands || [];
  if (player.spectator) {
    return `${renderActive(isActive)} ${name}: ${chalk.green('spectator')}`;
  } else {
    var handsText = '    no hands';
    if (hands.length > 0) {
      handsText = hands.map((hand, index) => {
        var isActiveHand = isActive && (index === handIndex);
        return `  ${renderHand(hand, isActiveHand)}`;
      }).join('\n');
    }
    return [
      `${renderActive(isActive)} ${name} (${renderMoney(bankroll)}):`,
      handsText
    ].join('\n');
  }
}

function renderPlayers (players, playerIndex, handIndex) {
  return players
    .map(player => player)
    .sort((a, b) => b.spectator - a.spectator)
    .map((player, index) => {
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

  function render (title, state) {
    clearScreen();
    console.log(`${chalk.green('#')} ${title}`);
    console.log('');
    console.log(renderState(state));
  }

  function onGameStart (state, makeBet) {
    render('GAME START', state);
    var me = state.players.find(player => player.name === name);

    if (!me.spectator) {
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
  }

  function onGameTurn (state, makeMove) {
    render('GAME TURN', state);

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

  function onGameEnd (state) {
    render('GAME END', state);
  }

  return {
    name: name,
    onGameStart,
    onGameTurn,
    onGameEnd
  };
};
