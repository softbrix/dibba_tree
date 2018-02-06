function hasChildren(node) {
  return node !== undefined &&
         node.children !== undefined &&
         Object.keys(node.children).length > 0;
}

// Expects that the node has children
function childKeys(node) {
  return Object.keys(node.children);
}

function getChildKey(node, keys) {
  var childKeyId = keys.indexOf(""+node.id);
  if(childKeyId === -1) {
    //console.log('Node has been deleted?', keys, node);
    // Node has been deleted?
    throw new Error('Node has been deleted?');
  }
  return childKeyId;
}

function moveDown(node, pickLastKey) {
  while(hasChildren(node)) {
    if(pickLastKey) {
      var keys = childKeys(node);
      var lastKeyId = keys.length - 1;
      var lastChildKey = keys[lastKeyId];
      node = node.children[lastChildKey]
    } else {
      var firstChildKey = childKeys(node)[0];
      node = node.children[firstChildKey];
    }
  }
  return node;
}

function findNextLeaf(node) {
  var parent = node.parent;

  if(parent !== undefined) {
    var keys = childKeys(parent);
    var childKeyId = getChildKey(node, keys);
    var nextChildId = childKeyId + 1;
    if(keys.length > nextChildId) {
      node = parent.children[keys[nextChildId]];
      return moveDown(node);
    } else {
      return findNextLeaf(parent);
    }
  }
  return undefined;
}

function findPrevLeaf(node) {
  var parent = node.parent;
  if(parent !== undefined) {
    var keys = childKeys(parent);
    var childKeyId = getChildKey(node, keys);
    var nextChildId = childKeyId - 1;
    if(nextChildId >= 0) {
      node = parent.children[keys[nextChildId]];
      return moveDown(node, true);
    } else {
      return findPrevLeaf(parent);
    }
  }
  return undefined;
}

function findClosestChildKey(node, childKey) {
  var keys = node.getChildrenKeys();
  var lastKey = keys[0], i = 0;
  while(++i < keys.length && keys[i] < childKey) {
    lastKey = keys[i];
  }
  return lastKey;
}

/**
Traverse the tree as long as we can with the current path, when there is no
match with the path and the children then move down to the closest leaf node.
*/
function findClosestLeaf(node, pathArray) {
  if(pathArray.length === 0 ||
     node.children.length === 0) {
    return node;
  }
  var subNodeId = pathArray[0];
  var childNode = node.children[subNodeId];
  if(childNode === undefined) {
    key = findClosestChildKey(node, subNodeId);
    // We might want the rightmost child if the requested id is larger than the given key
    return moveDown(node.children[key], key < subNodeId);
  }
  return findClosestLeaf(childNode, pathArray.slice(1));
}

/**
Handle both next and prev
**/
function step(stepNode, findStepNode) {
  if(stepNode == undefined) {
    this._node = findStepNode(this._node);
  } else {
    this._node = stepNode;
  }
  if(this._node == undefined) {
    return undefined;
  }
  return this._node.content;
}


function LeafIterator(tree, reverse) {
  if(tree === undefined) {
    throw new Error("Missing argument tree in leaf iterator");
  }
  this._tree = tree;

  if(reverse === true) {
    this._node = moveDown(tree.getNode(), true);
    this._prevNode = this._node;
    this._nextNode = undefined;
  } else {
    this._node = moveDown(tree.getNode());
    this._nextNode = this._node;
    this._prevNode = undefined;
  }
}

LeafIterator.prototype.hasNext = function() {
  if(this._nextNode == undefined) {
    this._nextNode = findNextLeaf(this._node);
  }
  return this._nextNode !== undefined;
}

LeafIterator.prototype.next = function() {
  var content = step.bind(this)(this._nextNode, findNextLeaf);
  this._nextNode = undefined;
  if(this._node !== undefined) {
    this._prevNode = this._node;
  }
  return content;
}

LeafIterator.prototype.hasPrev = function() {
  if(this._prevNode == undefined) {
    this._prevNode = findPrevLeaf(this._node);
  }
  return this._prevNode !== undefined;
}

LeafIterator.prototype.prev = function() {
  var content = step.bind(this)(this._prevNode, findPrevLeaf);
  this._prevNode = undefined;
  if(this._node !== undefined) {
    this._nextNode = this._node;
  }
  return content;
}

LeafIterator.prototype.getPath = function() {
  if(this._node !== undefined) {
    return this._node._getPath();
  }
  return undefined;
}

LeafIterator.prototype.gotoPath = function(path, pickLastKey) {
  this._node = this._tree.getNode.apply(this._tree, path);
  if(this._node === undefined) {
    this._node = findClosestLeaf(this._tree._rootNode, path);
  }
  this._node = moveDown(this._node, pickLastKey);
  this._nextNode = this._node;
  this._prevNode = this._node;
}

module.exports = LeafIterator;
