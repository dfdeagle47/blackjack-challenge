var _ = require('underscore');

var distribution = [];
// var iterations = 10;
var iterations = 100 * 1000;
var arr = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10
];
var dist;
var tmp;

for (var i = 0; i < iterations; i++) {
  tmp = _.clone(arr).sort((a, b) => Math.random() >= Math.random());

  if (i % 1000 === 0) {
    console.log(i, '/', iterations, '(', (i / (iterations / 100)), '%', ')');
  }

  for (var j = 0; j < tmp.length; j++) {
    dist = Math.abs(
      arr.indexOf(tmp[j]) - j
    );

    if (distribution[dist] === undefined) {
      distribution[dist] = 0;
    }

    distribution[dist] += 1;
  }
}

distribution = distribution.map(count => (count / iterations));

console.log(
  distribution
    .map(count => (count / (iterations / arr.length)))
    .map((count, index) => 'distance=' + index + ', count=' + count)
);
