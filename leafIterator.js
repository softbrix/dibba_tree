function hasChildren(node) {
  return node !== undefined &&
         node.children !== undefined &&
         Object.keys(node.children).length > 0;
}

// Expects that the node has children
function childKeys(node) {
  return Object.keys(node.children);
}

function moveDown(node, pointer, pickLastKey) {
  while(hasChildren(node)) {
    if(pickLastKey) {
      var keys = childKeys(node);
      var lastKeyId = keys.length - 1;
      var lastChildKey = keys[lastKeyId];
      pointer.push(lastKeyId);
      node = node.children[lastChildKey]
    } else {
      pointer.push(0);
      var firstChildKey = childKeys(node)[0];
      node = node.children[firstChildKey];
    }
  }
  return node;
}

function findNextChild(node, pointer) {
  var childKeyId = pointer.pop();
  var parent = node.parent;

  if(parent !== undefined) {
    var keys = childKeys(parent);
    var nextChildId = childKeyId + 1;
    if(keys.length > nextChildId) {
      pointer.push(nextChildId);
      node = parent.children[keys[nextChildId]];
      return moveDown(node, pointer);
    } else {
      return findNextChild(parent, pointer);
    }
  }
  return undefined;
}

function findPrevChild(node, pointer) {
  var childKeyId = pointer.pop();
  var parent = node.parent;
  if(parent !== undefined) {
    var keys = childKeys(parent);
    var nextChildId = childKeyId - 1;
    if(nextChildId >= 0) {
      pointer.push(nextChildId);
      node = parent.children[keys[nextChildId]];
      return moveDown(node, pointer, true);
    } else {
      return findPrevChild(parent, pointer);
    }
  }
  return undefined;
}

/**
Handle both next and prev
**/
function step(stepNode, newIndexPointer, findStepNode) {
  if(stepNode == undefined) {
    this._node = findStepNode(this._node, this._indexPointer);
  } else {
    this._indexPointer = newIndexPointer;
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
  this._indexPointer = [];
  this._node = moveDown(tree.getNode(), this._indexPointer);
  this._sortedChildrens = undefined;
  this._nextNode = this._node;
  this._nextNodePtr = this._indexPointer;
  this._prevNode = undefined;
  this._prevNodePtr = undefined;
}

LeafIterator.prototype.hasNext = function() {
  if(this._nextNode == undefined) {
    this._nextNodePtr = this._indexPointer.slice();
    this._nextNode = findNextChild(this._node, this._nextNodePtr);
  }
  return this._nextNode !== undefined;
}

LeafIterator.prototype.next = function() {
  var nextNode = this._nextNode;
  this._nextNode = undefined;
  return step.bind(this)(nextNode, this._nextNodePtr, findNextChild);
}

LeafIterator.prototype.hasPrev = function() {
  if(this._prevNode == undefined) {
    this._prevNodePtr = this._indexPointer.slice();
    this._prevNode = findPrevChild(this._node, this._prevNodePtr);
  }
  return this._prevNode !== undefined;
}

LeafIterator.prototype.prev = function() {
  var prevNode = this._prevNode;
  this._prevNode = undefined;
  return step.bind(this)(prevNode, this._prevNodePtr, findPrevChild);
}

module.exports = LeafIterator;
