var assert = require('assert');
var DibbaTree = require('../index.js');
var LeafIterator = require('../leafIterator.js');

describe('Dibba tree leaf iterator', function() {

  var simpleTree = function() {
    var tree = new DibbaTree();
    tree.insert('5', 1);  // sixth
    tree.insert('0', 0, 0, 0); // First
    tree.insert('Internal', 0, 0);  // Internal
    tree.insert('1', 0, 1); // second
    tree.insert('Internal', 0, 2);  // Internal
    tree.insert('3', 0, 2, 2);  // forth
    tree.insert('2', 0, 2, 1); // third
    tree.insert('4', 0, 3); // fifth
    tree.insert('6', 2, 0); // seventh
    return tree;
  };

  it('should iterate over the given tree with has next and has prev', function() {
    var it = new LeafIterator(simpleTree());
    var i = 0;
    assert.equal(false, it.hasPrev());
    for(i = 0; i <= 6; ++i) {
      assert.equal(true, it.hasNext(), 'Expected has next');
      assert.equal(it.next(), i);
    }
    assert.equal(false, it.hasNext());
    for( i = 6; i >= 0; --i) {
      assert.equal(true, it.hasPrev(), 'Expected has prev');
      assert.equal(it.prev(), i);
    }
    assert.equal(false, it.hasPrev());
  });

  it('should iterate over the given tree with only next and prev', function() {
    var it = new LeafIterator(simpleTree());
    var i = 0;
    assert.equal(false, it.hasPrev());
    for(i = 0; i <= 6; ++i) {
      assert.equal(it.next(), i);
    }
    assert.equal(false, it.hasNext());
    for( i = 6; i >= 0; --i) {
      assert.equal(it.prev(), i);
    }
    assert.equal(false, it.hasPrev());
  });

  it('should iterate over the given tree with items added after iterator was created', function() {
    var tree = new DibbaTree();
    tree.insert('2', 1);
    tree.insert('3', 2);
    var it = new LeafIterator(tree);
    assert.equal(it.next(), 2);
    assert.equal(it.next(), 3);
    tree.insert('1', 0);
    assert.equal(it.prev(), 3);
    assert.equal(it.prev(), 2);
    assert.equal(it.prev(), 1);
    assert.equal(false, it.hasPrev());
  });

  it('should return corrent path', function() {
    var it = new LeafIterator(simpleTree());
    // First path twice...
    // TODO: This should be undefined
    assert.deepEqual(it.getPath(), [0,0,0]);
    it.next();
    assert.deepEqual(it.getPath(), [0,0,0]);
    it.next();
    assert.deepEqual(it.getPath(), [0, 1]);
    it.next();
    assert.deepEqual(it.getPath(), [0, 2, 1]);
  });

  it('should goto path', function() {
    var it = new LeafIterator(simpleTree());
    assert.deepEqual(it.next(), 0);
    it.gotoPath(0, 2, 1); // Third
    assert.equal(it.next(), 4);
  });
});
