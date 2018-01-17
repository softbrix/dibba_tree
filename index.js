var LeafIterator = require('./leafIterator.js');

function DibbaNode(parent, id, content) {
  // The parent node, undefined for the root node
  this.parent = parent;
  // This is the node id
  this.id = id;
  // This is the children of the current node
  this.children = {};
  // This is the content of the node
  this.content = content;
}

/** Return the keys of the nodes childern */
DibbaNode.prototype.getChildrenKeys = function() {
  return Object.keys(this.children).sort();
};

/** Return all the leaves and child leaves from this node */
DibbaNode.prototype.getLeaves = function() {
  var nodeArray = flatten(this.children);
  return nodeArray.filter(node => node.content != undefined).map(node => node.content);
};

/** Return the path for the node by recursively calling its parents */
DibbaNode.prototype._getPath = function() {
  return getPath(this);
};

function getPath(node) {
  var path = [];
  while(node.parent) {
    path.push(node.id);
    node = node.parent;
  }
  return path.reverse();
}

function flatten(nodes, leafArray) {
  if(leafArray === undefined) {
    leafArray = [];
  }

  // Loop over the object array
  Object.keys(nodes).map(function(key) {
    var node = nodes[key];
    //console.log('getChild',node.id, node.getChildrenKeys, nodes.children);
    var nOfChildren = Object.keys(node.children).length;
    if(nOfChildren === 0) {
      leafArray.push(node);
    } else {
      leafArray = flatten(node.children, leafArray);
    }
  });

  return leafArray;
}

function findNode(node, pathArray, create) {
  if(pathArray.length === 0) {
    return node;
  }
  var subNodeId = pathArray[0];
  var childNode = node.children[subNodeId];
  if(childNode === undefined) {
    if(create) {
      childNode = node.children[subNodeId] = new DibbaNode(node, subNodeId);
    } else {
      return undefined;
    }
  }
  return findNode(childNode, pathArray.slice(1), create);
}

/** The subset helper will recursively go through all
the levels as long as the from or to parameters are not undefined or empty.
When the from and to parameters are empty then the entire subtree of the current
 node is copied */
function _subSetHelper(copyNode, from, to, newNode) {
  if(copyNode === undefined) {
    return;
  }
  var start = from !== undefined && from.length ? "" + from.shift() : undefined;
  var end = to !== undefined && to.length ? "" + to.shift() : undefined;
  newNode.content = copyNode.content;
  // No limits, copy all
  if(start === undefined && end === undefined) {
    newNode.children = copyNode.children;
  } else {
    copyNode.getChildrenKeys().forEach((x) => {
      if(start !== undefined && x < start) {
        return;
      }
      if(end !== undefined && x > end) {
        return false;
      }

      newNode.children[x] = new DibbaNode(newNode, x);
      var childNode = copyNode.children[x];
      _subSetHelper(childNode,
          start === x ? from : undefined,
          end === x ? to : undefined,
          newNode.children[x]);
    });
  }
}

function DibbaTree() {
  this._rootNode = new DibbaNode();
  this._size = 0;
}

/**
Insert the object to the given path. Could be any empty node. If the node path
does not exists from the root it will be created.
If the node already exists then this method will throw an error. If the update
is intentional then use the update method.
**/
DibbaTree.prototype.insert = function(content) {
  if(content === undefined || content === null) {
    throw Error('Content must not be undefined or null');
  }
  // Slice first parameter which is content
  var path = Array.prototype.slice.call(arguments, 1);
  var node = findNode(this._rootNode, path, true);
  if(node.content !== undefined) {
    throw Error('Node already exists');
  }
  node.content = content;
  this._size += 1;
};

/**
The update method works as insert but will replace the content of the node if it
 already exists.
**/
DibbaTree.prototype.update = function(content) {
  // Slice first parameter which is content
  var path = Array.prototype.slice.call(arguments, 1);
  var node = findNode(this._rootNode, path, true);
  if(node.content === undefined) {
    this._size += 1;
  }
  node.content = content;
};

/**
Remove a node from the tree. This method returns the node deleted node.
**/
DibbaTree.prototype.delete = function() {
  var node = this.getNode.apply(this, arguments);
  if(node === undefined) {
    return undefined;
  }
  if(node.parent === undefined) {
    // We got the root node, did we really want it?
    if(arguments.length === 0) {
      this._rootNode = new DibbaNode();
      this._size = 0;
    } else {
      throw Error('Internal error in DibbaTree, root node return when asking for: ' + path[0]);
    }
  } else {
    // Remove the node from the parent
    var lastPath = Array.prototype.slice.call(arguments, -1);
    delete node.parent.children[lastPath];
    this._size -= 1;
  }
  return node;
};

/**
Get the node in the tree.
**/
DibbaTree.prototype.getNode = function() {
  var path = Array.prototype.slice.call(arguments);
  return findNode(this._rootNode, path);
};

/**
Get the content of the node in the tree.
**/
DibbaTree.prototype.get = function() {
  var node = this.getNode.apply(this, arguments);
  if(node === undefined) {
    return undefined;
  }
  return node.content;
};

/**
Returns a subset tree of the tree from the first node to the end node inclusive
**/
DibbaTree.prototype.subSet = function(from, to) {
  if(from !== undefined && !Array.isArray(from)) {
    from = from._getPath();
  }
  if(to !== undefined && !Array.isArray(to)) {
    to = to._getPath();
  }
  var tree = new DibbaTree();
  _subSetHelper(this.getNode(), from, to, tree.getNode());
  return tree;
}

/**
Get the number of the nodes in the tree.
**/
DibbaTree.prototype.getSize = function() {
  return this._size;
}

/**
Return a new leaf iterator starting from the lower values in the tree
**/
DibbaTree.prototype.leafIterator = function() {
  return new LeafIterator(this);
}

/**
Return a new leaf iterator starting from the higher values in the tree
**/
DibbaTree.prototype.leafIteratorReverse = function() {
  return new LeafIterator(this, true);
}

module.exports = DibbaTree;
