var assert = require('assert');
var DibbaTree = require('../index.js');
var LeafIterator = require('../leafIterator.js');

describe('Dibba tree leaf iterator', function() {

  var tree;

  beforeEach(function() {
    tree = new DibbaTree();
    tree.insert('5', 1);  // sixth
    tree.insert('0', 0, 0, 0); // First
    tree.insert('Internal', 0, 0);  // Internal
    tree.insert('1', 0, 1); // second
    tree.insert('Internal', 0, 2);  // Internal
    tree.insert('3', 0, 2, 2);  // forth
    tree.insert('2', 0, 2, 1); // third
    tree.insert('4', 0, 3); // fifth
    tree.insert('6', 2, 0); // seventh
  });

  it('should iterate over the given tree with has next and prev', function() {
    var it = new LeafIterator(tree);
    var i = 0;
    assert.equal(false, it.hasPrev());
    for(i = 0; i <= 6; ++i) {
      assert.equal(true, it.hasNext(), 'Expected has next');
      assert.equal(it.next(), i, 'Expected children count');
    }
    assert.equal(false, it.hasNext());
    for( i = 5; i >= 0; --i) {
      assert.equal(true, it.hasPrev(), 'Expected has prev');
      assert.equal(it.prev(), i, 'Expected children count');
    }
    assert.equal(false, it.hasPrev());
  });

  it('should iterate over the given tree with only next and prev', function() {
    var it = new LeafIterator(tree);
    var i = 0;
    assert.equal(false, it.hasPrev());
    for(i = 0; i <= 6; ++i) {
      assert.equal(it.next(), i, 'Expected children count');
    }
    assert.equal(false, it.hasNext());
    for( i = 5; i >= 0; --i) {
      assert.equal(it.prev(), i, 'Expected children count');
    }
    assert.equal(false, it.hasPrev());
  });
});
