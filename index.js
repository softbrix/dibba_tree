
function DibbaNode(parent, content) {
  // The parent node, undefined for the root node
  this.parent = parent;
  // This is the children of the current node
  this.children = {};
  // This is the content of the node
  this.content = content;
}

function findNode(node, pathArray) {
  if(pathArray.length === 0) {
    return node;
  }
  var subNodeId = pathArray[0];
  var childNode = node.children[subNodeId];
  if(childNode === undefined) {
    return undefined;
  }
  return findNode(childNode, pathArray.slice(1));
}

function findOrCreateNode(node, pathArray) {
  if(pathArray.length === 0) {
    return node;
  }
  var subNodeId = pathArray[0];
  var childNode = node.children[subNodeId];
  if(childNode === undefined) {
    childNode = node.children[subNodeId] = new DibbaNode(node);
  }
  return findOrCreateNode(childNode, pathArray.slice(1));
}

function DibbaTree() {
  this.rootNode = new DibbaNode();
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
  var node = findOrCreateNode(this.rootNode, path);
  if(node.content !== undefined) {
    throw Error('Node already exists');
  }
  node.content = content;
};

/**
The update method works as insert but will replace the content of the node if it
 already exists.
**/
DibbaTree.prototype.update = function(content) {
  // Slice first parameter which is content
  var path = Array.prototype.slice.call(arguments, 1);
  var node = findOrCreateNode(this.rootNode, path);
  node.content = content;
};

/**
Remove a node from the tree. This method returns the node deleted node.
**/
DibbaTree.prototype.delete = function() {
  var path = Array.prototype.slice.call(arguments);
  var node = findNode(this.rootNode, path);
  if(node === undefined) {
    return undefined;
  }
  if(node.parent === undefined) {
    // We got the root node, did we really want it?
    if(path.length === 0) {
      this.rootNode = new DibbaNode();
    } else {
      throw Error('Internal error in DibbaTree, root node return when asking for: ' + path[0]);
    }
  } else {
    // Remove the node from the parent
    var lastPath = Array.prototype.slice.call(arguments, -1);
    delete node.parent.children[lastPath];
  }
  return node;
};

/**
Get the node in the tree.
**/
DibbaTree.prototype.getNode = function() {
  var path = Array.prototype.slice.call(arguments);
  return findNode(this.rootNode, path);
};

/**
Get the content of the node in the tree.
**/
DibbaTree.prototype.get = function() {
  var path = Array.prototype.slice.call(arguments);
  var node = findNode(this.rootNode, path);
  //console.log('findNode', path);
  if(node === undefined) {
    return node;
  }
  return node.content;
};

module.exports = DibbaTree;
