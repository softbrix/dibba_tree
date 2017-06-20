function hasChildren(node) {
  return node !== undefined &&
         node.children !== undefined &&
         Object.keys(node.children).length > 0;
}

// Expects that the node has children
function childKeys(node) {
  return Object.keys(node.children);
}

function moveDown(node, pointer) {
  while(hasChildren(node)) {
    pointer.push(0);
    var firstChildKey = childKeys(node)[0];
    node = node.children[firstChildKey];
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


function LeafIterator(tree) {
  if(tree === undefined) {
    throw new Error("Missing argument tree in leaf iterator");
  }
  this._tree = tree;
  this._indexPointer = [];
  this._node = moveDown(tree.getNode(), this._indexPointer);
  this._sortedChildrens = undefined;
  this._visited = false;
}

LeafIterator.prototype.hasNext = function() {
  if(this._visited && this._node !== undefined) {
    this._node = findNextChild(this._node, this._indexPointer);
    this._visited = false;
  }
  return this._node !== undefined;
}

LeafIterator.prototype.next = function() {
  if(this._visited == false) {
    this._visited = true;
  } else {
    if(this.hasNext() == false) {
      return undefined;
    }
  }
  return this._node.content;
}

module.exports = LeafIterator;
