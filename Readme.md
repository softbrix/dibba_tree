# Dibba tree
This is an simple tree data structure for javascript.

Create the tree instance by simply requiring the dibba_tree module and create a
new instance of the object.

Then you can use the insert, update and/or delete methods to modify the  
of the tree.

The first argument to the insert and update methods is the new content for the node.

The update method supports undefined and null as content whilst the insert
method strictly forbids this.

## LeafIterator

Since version 0.2.0 there has been an leaf iterator to the dibba tree. The iterator
is constructed with the tree object as a parameter and has the methods hasNext and next.
- The has next method returns a boolean if there are more objects in the tree.
- The next method returns the content of the current node. Will move on the next
  node if called again. Returns undefined if there are no more nodes to visit.
  But might also return undefined if the content of the node has been added with
   the update method.

Since version 0.2.1 the prev and hasPrev methods has been added. They both work
similar to the next and hasNext methods. 

## Why Dibba
Dibba is a town on the eastern coast of the United Arab Emirates. I got the idea
 of writing this module during a vacation there in the winter of 2017.
