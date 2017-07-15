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
    console.log(keys, node);
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

function findNextChild(node) {
  var parent = node.parent;

  if(parent !== undefined) {
    var keys = childKeys(parent);
    var childKeyId = getChildKey(node, keys);
    var nextChildId = childKeyId + 1;
    if(keys.length > nextChildId) {
      node = parent.children[keys[nextChildId]];
      return moveDown(node);
    } else {
      return findNextChild(parent);
    }
  }
  return undefined;
}

function findPrevChild(node) {
  var parent = node.parent;
  if(parent !== undefined) {
    var keys = childKeys(parent);
    var childKeyId = getChildKey(node, keys);
    var nextChildId = childKeyId - 1;
    if(nextChildId >= 0) {
      node = parent.children[keys[nextChildId]];
      return moveDown(node, true);
    } else {
      return findPrevChild(parent);
    }
  }
  return undefined;
}

function getPath(node) {
  var path = [];
  while(node.parent) {
    path.push(node.id);
    node = node.parent;
  }
  return path.reverse();
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


function LeafIterator(tree) {
  if(tree === undefined) {
    throw new Error("Missing argument tree in leaf iterator");
  }
  this._tree = tree;
  this._node = moveDown(tree.getNode());
  this._nextNode = this._node;
  this._prevNode = undefined;
}

LeafIterator.prototype.hasNext = function() {
  if(this._nextNode == undefined) {
    this._nextNode = findNextChild(this._node);
  }
  return this._nextNode !== undefined;
}

LeafIterator.prototype.next = function() {
  var content = step.bind(this)(this._nextNode, findNextChild);
  this._nextNode = undefined;
  if(this._node !== undefined) {
    this._prevNode = this._node;
  }
  return content;
}

LeafIterator.prototype.hasPrev = function() {
  if(this._prevNode == undefined) {
    this._prevNode = findPrevChild(this._node);
  }
  return this._prevNode !== undefined;
}

LeafIterator.prototype.prev = function() {
  var content = step.bind(this)(this._prevNode, findPrevChild);
  this._prevNode = undefined;
  if(this._node !== undefined) {
    this._nextNode = this._node;
  }
  return content;
}

LeafIterator.prototype.getPath = function() {
  if(this._node !== undefined) {
    return getPath(this._node);
  }
  return undefined;
}

LeafIterator.prototype.gotoPath = function() {
  var path = Array.prototype.slice.call(arguments);
  this._node = this._tree.getNode.apply(this._tree, arguments);
  this._nextNode = undefined;
  this._prevNode = undefined;
}

module.exports = LeafIterator;
