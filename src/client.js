'use strict';

var makePlayer = require('./human-player');
var network = require('./network');

var NAME = 'Jan';
var ENDPOINT = 'http://localhost:3000';

var player = makePlayer(NAME, {});
network.createClient(ENDPOINT).join(player);
