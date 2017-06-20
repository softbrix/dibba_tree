var assert = require('assert');
var DibbaTree = require('../index.js');
var LeafIterator = require('../leafIterator.js');

describe('Dibba tree leaf iterator', function() {

  describe('insert', function() {
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

    it('should iterate over the given tree', function() {
      var it = new LeafIterator(tree);
      for(var i = 0; i <= 6; ++i) {
        assert.equal(true, it.hasNext(), 'Expected has next');
        assert.equal(it.next(), i, 'Expected children count');
      }
      assert.equal(false, it.hasNext());
    });
  });
});
