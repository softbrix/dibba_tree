var assert = require('assert');
var DibbaTree = require('../index.js');

describe('Dibba tree', function() {

  var testObject1 = { a: 1};
  var testObject2 = { a: 2};
  var testObject3 = { a: 3};
  var testObject4 = { a: 4};

  describe('insert', function() {
    var tree = new DibbaTree();
    it('should handle report and error if we try to insert undefined', function() {
      assert.throws(tree.insert, Error, "Content must not be undefined or null");
    });

    it('should handle report and error if we try to insert null', function() {
      assert.throws(function() { tree.insert(null); }, Error, "Content must not be undefined or null");
    });

    it('should handle insert in the root node', function() {
      tree.insert(testObject1);
      assert.equal(testObject1, tree.get());
    });

    it('should handle insert in a first level path', function() {
      tree.insert(testObject1, 5);
      assert.equal(testObject1, tree.get(5));
    });

    it('should handle insert in a second level path', function() {
      tree.insert(testObject2, 5, 4);
      assert.equal(testObject2, tree.get(5, 4));
    });

    it('should handle insert in a new second level path', function() {
      tree.insert(testObject3, 2, 3);
      assert.equal(testObject3, tree.get(2, 3));
    });

    it('should throw error when reinserting same level', function() {
      tree.insert(testObject3, 1);
      assert.equal(testObject3, tree.get(1));
      assert.throws(function() {tree.insert(testObject1, 1);}, Error, "Node already exists");
    });

    it('should handle both int and string as key', function() {
      tree.insert(testObject4, 1, "a");
      assert.equal(testObject4, tree.get(1, "a"));
    });

    it('should handle string as key', function() {
      tree.insert(testObject3, "a", "b");
      assert.equal(testObject3, tree.get("a", "b"));
    });
  });

  describe('insert speed 1 level', function() {
    var tree = new DibbaTree();
    it('should be able to create 1000 child nodes in less than one sec', function() {
      var start = Date.now();
      var limit = 1000;
      for(var i = 0; i < limit; ++i) {
        tree.insert(i, i);
      }
      var rootNode = tree.getNode();
      assert.equal(limit, Object.keys(rootNode.children).length);
      assert.equal(true, (Date.now() - start) < 1000);
    });
  });

  describe('insert speed 2 level', function() {
    var tree = new DibbaTree();
    it('should be able to create 10 * 1000 child nodes in less than one sec', function() {
      var start = Date.now();
      var limit = 1000;
      var levels = 10;

      for(var lvl = 0; lvl < levels; ++lvl) {
        for(var i = 0; i < limit; ++i) {
          tree.insert(i, lvl, i);
        }
      }
      var rootNode = tree.getNode();
      assert.equal(levels, Object.keys(rootNode.children).length);
      assert.equal(true, (Date.now() - start) < 1000);
    });
  });

  describe('update', function() {
    var tree = new DibbaTree();
    it('should handle update in the root node', function() {
      tree.insert(testObject1);
      assert.equal(testObject1, tree.get());
      tree.update(testObject2);
      assert.equal(testObject2, tree.get());
    });

    it('should handle update to undefined in the root node', function() {
      assert.equal(testObject2, tree.get());
      tree.update(undefined);
      assert.equal(undefined, tree.get());
    });

    it('should handle update to null in the root node', function() {
      assert.equal(undefined, tree.get());
      tree.update(null);
      assert.equal(null, tree.get());
    });

    it('should handle update in a first level path', function() {
      var lvl = 5;
      tree.insert(testObject1, lvl);
      assert.equal(testObject1, tree.get(lvl));
      tree.update(testObject3, lvl);
      assert.equal(testObject3, tree.get(lvl));
    });

    it('should handle update node content to undefined in a arbitrary path', function() {
      var lvl = 7;
      tree.insert(testObject1, lvl);
      assert.equal(testObject1, tree.get(lvl));
      tree.update(undefined, lvl);
      assert.equal(undefined, tree.get(lvl));
    });

    it('should work the same as insert if node does not exist', function() {
      var lvl = 12;
      tree.update(testObject3, lvl);
      assert.equal(testObject3, tree.get(lvl));
    });

    it('should return the original object so it can be updated', function() {
      var lvl = 10;
      var testObj = {a : 100};
      tree.insert(testObj, lvl);
      var treeContent = tree.get(lvl);
      assert.equal(testObj, treeContent);
      treeContent.a = 123;
      assert.equal(123, tree.get(lvl).a);
    });
  });

  describe('delete', function() {
    var tree = new DibbaTree();
    it('should handle delete in the root node', function() {
      tree.insert(testObject1);
      assert.equal(testObject1, tree.get());
      tree.delete();
      assert.equal(undefined, tree.get());
    });

    it('should handle delete in a first level path', function() {
      var lvl = 5;
      tree.insert(testObject1, lvl);
      assert.equal(testObject1, tree.get(lvl));
      var deletedNode = tree.delete(lvl);
      assert.equal(lvl, deletedNode.id);
      assert.equal(testObject1, deletedNode.content);
      assert.equal(undefined, tree.get(lvl));
    });

    it('should handle delete in a second level path', function() {
      var lvl = 5;
      tree.insert(testObject1, lvl, lvl);
      assert.equal(testObject1, tree.get(lvl, lvl));
      var deletedNode = tree.delete(lvl, lvl);
      assert.equal(lvl, deletedNode.id);
      assert.equal(testObject1, deletedNode.content);
      assert.equal(undefined, tree.get(lvl, lvl));
    });
  });

  describe('access methods', function() {
    var tree = new DibbaTree();
    //                     root
    //       1      |        2      |        3
    //  1 |  2 |  3 |   4 |  5 |  6 |   7 |  8 |  9
    // 11 | 12 | 13 |  24 | 25 | 26 |  37 | 38 | 39

    tree.insert(11, 1, 1);
    tree.insert(12, 1, 2);
    tree.insert(13, 1, 3);

    tree.insert(24, 2, 4);
    tree.insert(25, 2, 5);
    tree.insert(26, 2, 6);

    tree.insert(37, 3, 7);
    tree.insert(38, 3, 8);
    tree.insert(39, 3, 9);

    it('should list childern at requested level', function() {
      assert.deepEqual([1,2,3], tree.getNode().getChildrenKeys());
      assert.deepEqual([1,2,3], tree.getNode(1).getChildrenKeys());
      assert.deepEqual([4,5,6], tree.getNode(2).getChildrenKeys());
    });

    it('should return leaves at requested level', function() {
      assert.deepEqual([11,12,13,24,25,26,37,38,39], tree.getNode().getLeaves());
      assert.deepEqual([24,25,26], tree.getNode(2).getLeaves());
      assert.deepEqual([], tree.getNode(1,1).getLeaves());
    });

    it('should return a subset with the specified parameter as array', function() {
      assert.deepEqual([/*11,12,*/13,24,25,26], tree.subSet([1,3], [3,6]).getNode().getLeaves());
      assert.deepEqual([/*11,12,13,*/24,25,26,37,38,39], tree.subSet([2,1], undefined).getNode().getLeaves());
      assert.deepEqual([11,12,13,24,25,26,37/*,38,39*/], tree.subSet(undefined, [3,7]).getNode().getLeaves());
    });

    it('should return a subset with the specified parameter as node', function() {
      assert.deepEqual([11,12,13,24,25,26/*,37,38,39*/], tree.subSet(tree.getNode(1), tree.getNode(2)).getNode().getLeaves());
      assert.deepEqual([11,12,13,24,25,26/*,37,38,39*/], tree.subSet(undefined, tree.getNode(2)).getNode().getLeaves());
      assert.deepEqual([11,12,13,24,25,26,37,38,39], tree.subSet(undefined, undefined).getNode().getLeaves());
    });

    it('should return a random element', function() {
      var len = 9;
      var hits = {};
      for (let i = 0; i < len; ++i) {
        let val = tree.randomLeaf();
        hits[val] = 1;
      }
      assert.equal(true, Object.keys(hits).length > 0)
    });

    it('should return a random element, eventually returns all elements', function() {
      var len = 9;
      var hits = {};
      for (let i = 0; i < len * 100; ++i) {
        let val = tree.randomLeaf();
        hits[val] = 1;
        if (Object.keys(hits).length == len) {
          break;
        }
      }
      assert.equal(len, Object.keys(hits).length)
    });
  });

  describe('leafIterator', function() {
    var tree = new DibbaTree();
    it('should return a leafIterator', function() {
      tree.insert(testObject1,0);
      tree.update(testObject2,1);
      var it = tree.leafIterator();
      assert.equal(testObject1, it.next());
      assert.equal(testObject2, it.next());
      assert.equal(false, it.hasNext());
    });

    it('should return a reverse leafIterator', function() {
      var it = tree.leafIteratorReverse();
      assert.equal(testObject2, it.prev());
      assert.equal(testObject1, it.prev());
      assert.equal(false, it.hasPrev());
    });
  });
});
