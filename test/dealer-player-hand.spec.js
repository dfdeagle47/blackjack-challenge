/* globals describe, it */

'use strict';

const assert = require('assert');

const DealerHand = require('../src/blackjack/dealer-hand');
const actions = require('../src/blackjack/actions');
const Card = require('../src/blackjack/card');

describe('Card', () => {
  it('hit on hard 16 without s17', () => {
    const s17 = false;
    const card1 = new Card(10);
    const card2 = new Card(6);
    const dealerHand = new DealerHand(
      [
        card1,
        card2
      ],
      s17
    );
    const nextActions = dealerHand.getNextActions();

    assert.strictEqual(Array.isArray(nextActions), true);
    assert.strictEqual(nextActions.length, 1);
    assert.strictEqual(nextActions[0], actions.HIT);
  });

  it('hit on soft 16 without s17', () => {
    const s17 = false;
    const card1 = new Card(1);
    const card2 = new Card(5);
    const dealerHand = new DealerHand(
      [
        card1,
        card2
      ],
      s17
    );
    const nextActions = dealerHand.getNextActions();

    assert.strictEqual(Array.isArray(nextActions), true);
    assert.strictEqual(nextActions.length, 1);
    assert.strictEqual(nextActions[0], actions.HIT);
  });

  it('hit on hard 16 with s17', () => {
    const s17 = true;
    const card1 = new Card(10);
    const card2 = new Card(6);
    const dealerHand = new DealerHand(
      [
        card1,
        card2
      ],
      s17
    );
    const nextActions = dealerHand.getNextActions();

    assert.strictEqual(Array.isArray(nextActions), true);
    assert.strictEqual(nextActions.length, 1);
    assert.strictEqual(nextActions[0], actions.HIT);
  });

  it('hit on soft 16 with s17', () => {
    const s17 = true;
    const card1 = new Card(1);
    const card2 = new Card(5);
    const dealerHand = new DealerHand(
      [
        card1,
        card2
      ],
      s17
    );
    const nextActions = dealerHand.getNextActions();

    assert.strictEqual(Array.isArray(nextActions), true);
    assert.strictEqual(nextActions.length, 1);
    assert.strictEqual(nextActions[0], actions.HIT);
  });

  it('stand on hard 17 without s17', () => {
    const s17 = false;
    const card1 = new Card(10);
    const card2 = new Card(7);
    const dealerHand = new DealerHand(
      [
        card1,
        card2
      ],
      s17
    );
    const nextActions = dealerHand.getNextActions();

    assert.strictEqual(Array.isArray(nextActions), true);
    assert.strictEqual(nextActions.length, 1);
    assert.strictEqual(nextActions[0], actions.STAND);
  });

  it('stand on soft 17 without s17', () => {
    const s17 = false;
    const card1 = new Card(1);
    const card2 = new Card(6);
    const dealerHand = new DealerHand(
      [
        card1,
        card2
      ],
      s17
    );
    const nextActions = dealerHand.getNextActions();

    assert.strictEqual(Array.isArray(nextActions), true);
    assert.strictEqual(nextActions.length, 1);
    assert.strictEqual(nextActions[0], actions.STAND);
  });

  it('stand on hard 17 with s17', () => {
    const s17 = true;
    const card1 = new Card(10);
    const card2 = new Card(7);
    const dealerHand = new DealerHand(
      [
        card1,
        card2
      ],
      s17
    );
    const nextActions = dealerHand.getNextActions();

    assert.strictEqual(Array.isArray(nextActions), true);
    assert.strictEqual(nextActions.length, 1);
    assert.strictEqual(nextActions[0], actions.STAND);
  });

  it('hit on soft 17 with s17', () => {
    const s17 = true;
    const card1 = new Card(1);
    const card2 = new Card(6);
    const dealerHand = new DealerHand(
      [
        card1,
        card2
      ],
      s17
    );
    const nextActions = dealerHand.getNextActions();

    assert.strictEqual(Array.isArray(nextActions), true);
    assert.strictEqual(nextActions.length, 1);
    assert.strictEqual(nextActions[0], actions.HIT);
  });

  it('stand on hard 18 without s17', () => {
    const s17 = false;
    const card1 = new Card(10);
    const card2 = new Card(8);
    const dealerHand = new DealerHand(
      [
        card1,
        card2
      ],
      s17
    );
    const nextActions = dealerHand.getNextActions();

    assert.strictEqual(Array.isArray(nextActions), true);
    assert.strictEqual(nextActions.length, 1);
    assert.strictEqual(nextActions[0], actions.STAND);
  });

  it('stand on soft 18 without s17', () => {
    const s17 = false;
    const card1 = new Card(1);
    const card2 = new Card(7);
    const dealerHand = new DealerHand(
      [
        card1,
        card2
      ],
      s17
    );
    const nextActions = dealerHand.getNextActions();

    assert.strictEqual(Array.isArray(nextActions), true);
    assert.strictEqual(nextActions.length, 1);
    assert.strictEqual(nextActions[0], actions.STAND);
  });

  it('stand on hard 18 with s17', () => {
    const s17 = true;
    const card1 = new Card(10);
    const card2 = new Card(8);
    const dealerHand = new DealerHand(
      [
        card1,
        card2
      ],
      s17
    );
    const nextActions = dealerHand.getNextActions();

    assert.strictEqual(Array.isArray(nextActions), true);
    assert.strictEqual(nextActions.length, 1);
    assert.strictEqual(nextActions[0], actions.STAND);
  });

  it('stand on soft 18 with s17', () => {
    const s17 = true;
    const card1 = new Card(1);
    const card2 = new Card(7);
    const dealerHand = new DealerHand(
      [
        card1,
        card2
      ],
      s17
    );
    const nextActions = dealerHand.getNextActions();

    assert.strictEqual(Array.isArray(nextActions), true);
    assert.strictEqual(nextActions.length, 1);
    assert.strictEqual(nextActions[0], actions.STAND);
  });
});
