'use strict';

var network = require('./network');
var minimist = require('minimist');
var actions = require('./blackjack/actions.js')
var _ = require('underscore');

var argv = minimist(process.argv.slice(2));

if (!argv.table) {
  // console.log('--table required');
  // process.exit(1);
  argv.table = 'http://localhost:9000';
}

var bestStrategy = function(player, dealer) {
  var playerScore = computeScoreForHand(player.hands[0]);
  var dealerScore = computeScoreForHand(dealer.hands[0]);
  var actionsToDo = actions.STAND;
  var playerHasAce = hasAce(player.hands[0]);
  var playerHand = player.hands[0];
  var otherCardScore;
  var onlyTwoCards = playerHand.cards.length === 2;
  if (onlyTwoCards) {
    otherCardScore = playerScore - 11;
  }
  if (hasAce && onlyTwoCards && otherCardScore <= 6) {
    actionsToDo = actions.HIT;
  } else if (hasAce && onlyTwoCards && otherCardScore === 7) {
    if (dealerScore <= 8) {
      actionsToDo = actions.STAND
    } else {
      actionsToDo = actions.HIT;
    }
  } else if (hasAce && onlyTwoCards && 8 <= otherCardScore && otherCardScore <= 9) {
    actionsToDo = actions.STAND;
  } else if (playerScore <= 11) {
    actionsToDo = actions.HIT;
  } else if (
    playerScore >= 17
    || 13 <= playerScore && playerScore <= 16 && dealerScore <= 6
    || playerScore === 12 && (dealerScore === 4 || dealerScore === 5 || dealerScore === 6)
    ) {
    return actions.STAND;
  } else if (12 <= playerScore && playerScore <= 16 && dealerScore >= 7) {
    actionsToDo = actions.HIT;
  }

  return actionsToDo;
}

var hasAce = function(hand) {
  for (var i = 0, len = hand.cards.length; i < len; i++) {
    if (hand.cards[i].rank === 1) {
      return true;
    }
  }

  return false;
}

var getHiLoValue = function(card) {
  switch(card.rank) {
    case 10:
    case 11:
    case 12:
    case 13:
    case 1:
      return -1;
    case 7:
    case 8:
    case 9:
      return 0;
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
      return 1;
  }
};
  
var computeScoreForHand = function(hand) {
  let aceIs11 = true;
  var score = hand.cards.reduce((res, c) => {
    let inc;

    switch(c.rank) {
    case 10:
    case 11:
    case 12:
    case 13:
      inc = 10;
      break;
    case 1:
      if (aceIs11) {
        aceIs11 = false;
        inc = 11
      }
      inc = 1;
      break;
    default:
      inc = c.rank;
      break
  }

    return res + inc;
  }, 0);

  if (score <= 21) {
    return score;
  }

  if (!aceIs11) {
    return score - 10;
  }

  return score;
}

function start () {
  var playerCountingScore = 0;
  var bankCountingScore = 0;

  var game = network.createClient(argv.table).join({
    name: '\xE2\x98\xA0table 13\xE2\x98\xA0',
    onGameStart (state, makeBet) {
      makeBet({ amount: 10 });
    },
    onGameTurn (state, makeMove) {
      const player = state.players[state.playerIndex];
      const dealer = _.find(state.players, {dealer: true});

      makeMove({move: bestStrategy(player, dealer)});
    },
    onGameEnd (state) {
      var lastState = state.players[state.playerIndex].hands[0].state;
     
      if (state.players[state.playerIndex].spectator) {
        game.quit();
        setTimeout(() => start(), 10000);
      }
    }
  });
}

console.log(`starting bot on ${argv.table}`);
start();