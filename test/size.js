var assert = require('assert');
var DibbaTree = require('../index.js');

describe('Dibba tree size', function() {

  var testObject1 = { a: 1};
  var testObject2 = { a: 2};
  var testObject3 = { a: 3};
  var testObject4 = { a: 4};

  describe('insert', function() {
    var tree;

    beforeEach(function() {
      tree = new DibbaTree();
    });

    it('should increase size when insert', function() {
      assert.equal(0, tree.getSize());
      tree.insert(testObject1);
      assert.equal(1, tree.getSize());
    });

    it('should increase size when update non existing object', function() {
      assert.equal(0, tree.getSize());
      tree.update(testObject2);
      assert.equal(1, tree.getSize());
    });

    it('should not increase size when update existing object', function() {
      assert.equal(0, tree.getSize());
      tree.insert(testObject1);
      assert.equal(1, tree.getSize());
      tree.update(testObject2);
      assert.equal(1, tree.getSize());
    });

    it('should not decrease size when delete existing object', function() {
      assert.equal(0, tree.getSize());
      tree.insert(testObject1);
      assert.equal(1, tree.getSize());
      tree.delete();
      assert.equal(0, tree.getSize());
    });

    it('should increase size when insert multiple objects', function() {
      assert.equal(0, tree.getSize());
      tree.insert(testObject1, 1);
      tree.insert(testObject2, 2);
      tree.insert(testObject3, 3);
      assert.equal(3, tree.getSize());
    });

    it('should update size when insert multiple objects and then delete', function() {
      assert.equal(0, tree.getSize());
      tree.insert(testObject1, 1);
      tree.insert(testObject2, 2);
      tree.insert(testObject3, 3);
      assert.equal(3, tree.getSize());
      tree.delete(1);
      tree.delete(3);
      assert.equal(1, tree.getSize());
    });
  });
});
