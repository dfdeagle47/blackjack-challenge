/* globals describe, it */

'use strict';

const assert = require('assert');

const Card = require('../src/blackjack/card');

describe('Card', () => {
  it('card has index for single deck', () => {
    const card = new Card(1);
    const index = card.getIndex();

    assert.strictEqual(index, 1);
  });

  it('card has index for multiple decks', () => {
    const card = new Card(1 + 52);
    const index = card.getIndex();

    assert.strictEqual(index, 1);
  });

  it('aces have two values for single deck', () => {
    const card = new Card(1);
    const values = card.getValues();

    assert.strictEqual(Array.isArray(values), true);
    assert.strictEqual(values.length, 2);
    assert.strictEqual(values[0], 1);
    assert.strictEqual(values[1], 11);
  });

  it('other cards have one values for single deck', () => {
    const card = new Card(2);
    const values = card.getValues();

    assert.strictEqual(Array.isArray(values), true);
    assert.strictEqual(values.length, 1);
    assert.strictEqual(values[0], 2);
  });

  it('aces have two values for multiple decks', () => {
    const card = new Card(1 + 52);
    const values = card.getValues();

    assert.strictEqual(Array.isArray(values), true);
    assert.strictEqual(values.length, 2);
    assert.strictEqual(values[0], 1);
    assert.strictEqual(values[1], 11);
  });

  it('other cards have one values for multiple decks', () => {
    const card = new Card(2 + 52);
    const values = card.getValues();

    assert.strictEqual(Array.isArray(values), true);
    assert.strictEqual(values.length, 1);
    assert.strictEqual(values[0], 2);
  });

  it('card has suit for single deck', () => {
    const card = new Card(1);
    const suit = card.getSuit();

    assert.strictEqual(suit, 'hearts');
  });

  it('card has suit for multiple decks', () => {
    const card = new Card(1 + 52);
    const suit = card.getSuit();

    assert.strictEqual(suit, 'hearts');
  });

  it('kings have rank for single deck', () => {
    const card = new Card(52);
    const rank = card.getRank();

    assert.strictEqual(rank, 13);
  });

  it('other cards have rank for single deck', () => {
    const card = new Card(51);
    const rank = card.getRank();

    assert.strictEqual(rank, 12);
  });

  it('kings have rank for multiple decks', () => {
    const card = new Card(52 + 52);
    const rank = card.getRank();

    assert.strictEqual(rank, 13);
  });

  it('other cards have rank for multiple decks', () => {
    const card = new Card(51 + 52);
    const rank = card.getRank();

    assert.strictEqual(rank, 12);
  });
});
