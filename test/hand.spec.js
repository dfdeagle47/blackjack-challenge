/* globals describe, it */

'use strict';

const assert = require('assert');

const actions = require('../src/blackjack/actions');
const Card = require('../src/blackjack/card');
const Hand = require('../src/blackjack/hand');

describe('Hand', () => {
  it('can\'t hit on natural blackjack', () => {
    const card1 = new Card(10);
    const card2 = new Card(1);
    const hand = new Hand(
      [
        card1,
        card2
      ]
    );
    const nextActions = hand.getNextActions();

    assert.strictEqual(Array.isArray(nextActions), true);
    assert.strictEqual(nextActions.length, 1);
    assert.strictEqual(nextActions[0], actions.STAND);
  });

  it('can\'t hit on blackjack', () => {
    const card1 = new Card(10);
    const card2 = new Card(5);
    const card3 = new Card(6);
    const hand = new Hand(
      [
        card1,
        card2
      ]
    );
    hand.addCard(card3);
    const nextActions = hand.getNextActions();

    assert.strictEqual(Array.isArray(nextActions), true);
    assert.strictEqual(nextActions.length, 1);
    assert.strictEqual(nextActions[0], actions.STAND);
  });

  it('can hit or stand on hand', () => {
    const card1 = new Card(10);
    const card2 = new Card(5);
    const hand = new Hand(
      [
        card1,
        card2
      ]
    );
    const nextActions = hand.getNextActions();

    assert.strictEqual(Array.isArray(nextActions), true);
    assert.strictEqual(nextActions.length, 2);
    assert.strictEqual(nextActions[0], actions.HIT);
    assert.strictEqual(nextActions[1], actions.STAND);
  });

  it('can split on same value cards', () => {
    const card1 = new Card(4);
    const card2 = new Card(4);
    const hand = new Hand(
      [
        card1,
        card2
      ]
    );
    const nextActions = hand.getNextActions();

    assert.strictEqual(Array.isArray(nextActions), true);
    assert.strictEqual(nextActions.length, 3);
    assert.strictEqual(nextActions[0], actions.HIT);
    assert.strictEqual(nextActions[1], actions.STAND);
    assert.strictEqual(nextActions[2], actions.SPLIT);
  });

  it('can\'t split on same value cards with more than two cards', () => {
    const card1 = new Card(5);
    const card2 = new Card(5);
    const card3 = new Card(5);
    const hand = new Hand(
      [
        card1,
        card2
      ]
    );
    hand.addCard(card3);
    const nextActions = hand.getNextActions();

    assert.strictEqual(Array.isArray(nextActions), true);
    assert.strictEqual(nextActions.length, 2);
    assert.strictEqual(nextActions[0], actions.HIT);
    assert.strictEqual(nextActions[1], actions.STAND);
  });

  it('can\'t double down on total 8', () => {
    const card1 = new Card(3);
    const card2 = new Card(5);
    const hand = new Hand(
      [
        card1,
        card2
      ]
    );
    const nextActions = hand.getNextActions();

    assert.strictEqual(Array.isArray(nextActions), true);
    assert.strictEqual(nextActions.length, 2);
    assert.strictEqual(nextActions[0], actions.HIT);
    assert.strictEqual(nextActions[1], actions.STAND);
  });

  it('can double down on total 9', () => {
    const card1 = new Card(4);
    const card2 = new Card(5);
    const hand = new Hand(
      [
        card1,
        card2
      ]
    );
    const nextActions = hand.getNextActions();

    assert.strictEqual(Array.isArray(nextActions), true);
    assert.strictEqual(nextActions.length, 3);
    assert.strictEqual(nextActions[0], actions.HIT);
    assert.strictEqual(nextActions[1], actions.STAND);
    assert.strictEqual(nextActions[2], actions.DOUBLE_DOWN);
  });

  it('can double down on total 10', () => {
    const card1 = new Card(4);
    const card2 = new Card(6);
    const hand = new Hand(
      [
        card1,
        card2
      ]
    );
    const nextActions = hand.getNextActions();

    assert.strictEqual(Array.isArray(nextActions), true);
    assert.strictEqual(nextActions.length, 3);
    assert.strictEqual(nextActions[0], actions.HIT);
    assert.strictEqual(nextActions[1], actions.STAND);
    assert.strictEqual(nextActions[2], actions.DOUBLE_DOWN);
  });

  it('can double down on total 11', () => {
    const card1 = new Card(5);
    const card2 = new Card(6);
    const hand = new Hand(
      [
        card1,
        card2
      ]
    );
    const nextActions = hand.getNextActions();

    assert.strictEqual(Array.isArray(nextActions), true);
    assert.strictEqual(nextActions.length, 3);
    assert.strictEqual(nextActions[0], actions.HIT);
    assert.strictEqual(nextActions[1], actions.STAND);
    assert.strictEqual(nextActions[2], actions.DOUBLE_DOWN);
  });

  it('can\'t double down on total 12', () => {
    const card1 = new Card(5);
    const card2 = new Card(7);
    const hand = new Hand(
      [
        card1,
        card2
      ]
    );
    const nextActions = hand.getNextActions();

    assert.strictEqual(Array.isArray(nextActions), true);
    assert.strictEqual(nextActions.length, 2);
    assert.strictEqual(nextActions[0], actions.HIT);
    assert.strictEqual(nextActions[1], actions.STAND);
  });

  it('can\'t double down with more than two cards', () => {
    const card1 = new Card(2);
    const card2 = new Card(6);
    const card3 = new Card(3);
    const hand = new Hand(
      [
        card1,
        card2
      ]
    );
    hand.addCard(card3);
    const nextActions = hand.getNextActions();

    assert.strictEqual(Array.isArray(nextActions), true);
    assert.strictEqual(nextActions.length, 2);
    assert.strictEqual(nextActions[0], actions.HIT);
    assert.strictEqual(nextActions[1], actions.STAND);
  });

  it('can\'t hit after double down', () => {
    const card1 = new Card(5);
    const card2 = new Card(6);
    const card3 = new Card(9);
    const hand = new Hand(
      [
        card1,
        card2
      ]
    );
    hand.setHasDoubledDown(true);
    hand.addCard(card3);
    const nextActions = hand.getNextActions();

    assert.strictEqual(Array.isArray(nextActions), true);
    assert.strictEqual(nextActions.length, 1);
    assert.strictEqual(nextActions[0], actions.STAND);
  });

  it('can split and double down with 5 and 5', () => {
    const card1 = new Card(5);
    const card2 = new Card(5);
    const hand = new Hand(
      [
        card1,
        card2
      ]
    );
    const nextActions = hand.getNextActions();

    assert.strictEqual(Array.isArray(nextActions), true);
    assert.strictEqual(nextActions.length, 4);
    assert.strictEqual(nextActions[0], actions.HIT);
    assert.strictEqual(nextActions[1], actions.STAND);
    assert.strictEqual(nextActions[2], actions.DOUBLE_DOWN);
    assert.strictEqual(nextActions[3], actions.SPLIT);
  });
});
