## Binary Search Tree
- In programming, trees are a data structure that come up surprisingly often! 
- They have a number of different use cases ranging from efficient data storage to representing a file heirarchy.
- In this particular lesson we're going to go over the Binary Search Tree. 
- Trees start with a root node which branches to nodes underneath it (its children). 
    - The word binary indicates that each nodes has at most 2 children. 
    - It's called a search tree because the order of the nodes is sorted by the value of the data. Let's take a look at an example:
![Root](https://res.cloudinary.com/divzjiip8/image/upload/v1572547868/Frame_1_49_m4as8k.png)
    - Any child that is to the left of it's parent is smaller. 
    - Any child that is to the right of it's parent is greater. 
    - For example, the root 5 has two children 3 and 7. Since 3 is less than 5, it is to the left of 5.
- Knowing that the data is in this order, it will take us less time to find a particular node. We can look for 4. 
    - Starting at the root, we know it's less than 5 so we go left. 
    - We encounter 3 next and know that 4 is greater than 3, so we go right. 
    - There, we find 4. On average this will be faster than searching randomly. 
    - The time savings become greater the bigger the tree is.

---

### Table of Contents
1. [Node](#node)
    - [Creating a Node](#creating-a-node)
    - [Your Goal: Complete Constructor](#your-goal-complete-constructor)
1. [Tree](#tree)
    - [Storing the Root](#storing-the-root)
    - [Your Goal: Store the Root](#your-goal-store-the-root)
1. [Add Root](#add-root)
    - [Adding a root](#adding-a-root)
    - [Your Goal: Add Node Method](#your-goal-add-node-method)
1. [First Layer](#first-layer)
    - [Your Goal: Modify Add Node](#your-goal-modify-add-node)
1. [Many Layers](#many-layers)
    - [Generalizing](#generalizing)
    - [Recursive Solution](#recursive-solution)
    - [Iterative Solution](#iterative-solution)
1. [Search](#search)
    - [Search Tree](#search-tree)
    - [Your Goal: hasNode method](#your-goal-hasnode-method)
---

### Node
#### Creating a Node
- Let's first create the class Node, from which we will create each element inside of our tree:
![Node](https://res.cloudinary.com/divzjiip8/image/upload/v1572548951/Frame_1_50_wiuxcn.png)
- The node should contain data, which in this case is 5.
    - It should also contain references to the left child (3) and the right child (7).
#### Your Goal: Complete Constructor
- Complete the constructor function on the node.
    - Store the ``data`` inside a ``data`` property on the instance.
- Store null in properties ``left`` and ``right``.
- Usage Example:
```js
const node = new Node(5);

console.log(node.data); // 5
console.log(node.left); // null
console.log(node.right); // null
```
---

**SOLUTION**
```js
class Node {
    constructor(data) {
        this.data = data;
        this.right = null;
        this.left = null;
    }
}

module.exports = Node;
```
---

### Tree
#### Storing the Root
- A tree will keep track of one property: a reference to the root node.
![Root](https://res.cloudinary.com/divzjiip8/image/upload/v1572549482/Frame_1_51_x1l4si.png)
#### Your Goal: Store the Root
- Finish the constructor function on the ``Tree`` class in the new file ``Tree.js``.
- All you need to do for now is store ``null`` on a ``root`` property.
```js
const tree = new Tree();

console.log(tree.root); // null
```
---

**SOLUTION**
```js
class Tree {
    constructor() {
        this.root = null;
    }
}

module.exports = Tree;
```

---

### Add Root
#### Adding a Root
- In this stage we'll create a new method for adding nodes to our tree.
- This is a difficult task to generalize so we'll attack it piece by piece!
- First let's start by adding a root to an empty tree.
![Root](https://res.cloudinary.com/divzjiip8/image/upload/v1572549735/Frame_1_52_gqn5ik.png)
#### Your Goal: Add Node Method
- Create a new method ``addNode`` on ``Tree`` which will take a new ``node`` and add it to the tree.
- Assume that the tree is empty for this stage.
    - Simply set the root to be the node passed into the method.
```js
// create a new tree and new node
const tree = new Tree();
const node = new Node(5);

// add the node to the tree using addNode
tree.addNode(node);

// the new node becomes the tree's root
console.log(tree.root.data); // 5
```

---

**SOLUTION**
```js
class Tree {
    constructor() {
        this.root = null;
    }
    addNode(node){
        this.root = node;
    }
}

module.exports = Tree;
```

---

### First Layer
- Now it's time to focus on adding the first layer of nodes underneath our root!
- Keep the code you used to pass the last stage and then add another case for when a root already exists
![First Layer](https://res.cloudinary.com/divzjiip8/image/upload/v1572550307/Frame_1_53_vgill7.png)
- When the root already exists, we'll need to decide which side to add the new leaf node to.
    - If the new node ``data`` is **less than** the root data, we'll want to add it to the **left**.
    - Conversely, if the data is **greater** we'll add it to the **right**.
#### Your Goal: Modify Add Node
- Modify the ``addNode`` function to **also** handle adding the first children of the ``root``.
```js
const tree = new Tree();
const node1 = new Node(5);
const node2 = new Node(3);
const node3 = new Node(7);

tree.addNode(node1);
tree.addNode(node2);
tree.addNode(node3);

console.log(tree.root.left.data); // 3
console.log(tree.root.right.data); // 7
```

---
**SOLUTION**
```js
class Tree {
    constructor() {
        this.root = null;
    }
    addNode(node){
        if(!this.root){
            this.root = node;
        }
        if (this.root.data > node.data){
            this.root.left = node
        }
        if (this.root.data< node.data){
            this.root.right = node
        }
    }
}

module.exports = Tree;
```
---

### Many Layers
#### Generalizing
- Now it's time to make our addNode function work for many layers of the tree:
![Generalizing](https://res.cloudinary.com/divzjiip8/image/upload/v1572550789/Frame_1_54_ec9o91.png)


#### Recursive Solution
- You already wrote the code to add a node underneath another node. All we need to do is apply this recursively.
- So far your code does this:
![Recursive Solution](https://res.cloudinary.com/divzjiip8/image/upload/v1572551256/Frame_1_55_yonmzv.png)
- Now we just need to do add a node underneath a different node:
![Recursive Solution](https://res.cloudinary.com/divzjiip8/image/upload/v1572551335/Frame_1_56_hlicqo.png)
- A good way to start the recursive solution is to write a new function on Tree that will take two arguments: a parent and a child.
    - This function should add the child under the parent node.
- If the child data is less than the parent data, then it should go left
    - If the parent already has a left node, call this new function recursively with that left node as the parent.
    - If the parent does not have a left node, set the new node as the new left node.
- If the child data is greater than the parent data, then is should go right
    - If the parent already has a right node, call this new function recursively with that right node as the parent.
    - If the parent does not have a right node, set the new node as the new right node.
- Now you can call this method from addNode if there is an existing root.
    - Initially the root will be the parent, and this will expand as more nodes get added.

#### Iterative Solution
- The iterative solution can be similar to the recursive solution.
    - In our opinion it is more difficult.
    - You'll likely want to iterate until you find the point where you can add the node by using a while(true) and then break or return after you've added the node.
- Similar to the recursive solution you change the node your focused on by storing a reference and changing that reference as you move down the tree.
- So at first your reference might be the root:
![Iterative Solution](https://res.cloudinary.com/divzjiip8/image/upload/v1572551256/Frame_1_55_yonmzv.png)
- Then you can shift the reference to be the next node as you move downwards:
![Iterative Solution](https://res.cloudinary.com/divzjiip8/image/upload/v1572551335/Frame_1_56_hlicqo.png)
- You'll continue to shift the reference until you find a spot to add your new node.
    - Once you've found that spot, you can add the node and break to escape the while(true) loop.

####  Your Goal: Generalize
- Complete the function addNode so that it can handle adding nodes no matter how large the tree gets.

---
**SOLUTION**
- ***Recursive***
```js
class Tree {
    constructor() {
        this.root = null;
    }
    addNode(node){
        if(!this.root){
            this.root = node;
        } else {
            this.addChild(this.root,node)
        }
    }
    addChild(parent, child) {
        if (child.data < parent.data) {
            if (parent.left) {
                this.addChild(parent.left, child)
            } else {
                parent.left = child
            }
        }
        if (child.data > parent.data) {
            if (parent.right) {
                this.addChild(parent.right,child)
            } else {
                parent.right = child
            }
        }
    }
}

module.exports = Tree;
```
- ***Iterative***
```js
class Tree {
    constructor() {
        this.root = null;
    }

    addNode(node) {
        if(!this.root) {
            this.root = node;
            return;
        }

        let ptr = this.root;
        while(true) {
            if(node.data < ptr.data) {
                if(!ptr.left) {
                    ptr.left = node;
                    break;
                }
                else {
                    ptr = ptr.left;
                }
            }
            if (node.data > ptr.data) {
                if (!ptr.right) {
                    ptr.right = node;
                    break;
                }
                else {
                    ptr = ptr.right;
                }
            }
        }
    }
}

module.exports = Tree;
```
---

### Search
#### Search Tree
- It's time to reap the rewards of creating our binary search tree. That's right, it's time to search!
- Let's use the sort order to find nodes in the tree. For instance, if we were searching for the node 4:
![Search Tree](https://res.cloudinary.com/divzjiip8/image/upload/v1572552613/Frame_1_57_k9ywj1.png)
1. We start at the root 5, recognize that 4 is less than 5 so we move left.
2. We find 3, recognize that 4 is greater than 3 so we move right.
3. We find 4, recognize this is what we are looking for and return true.
- If we search for a missing node, we return false.
- For instance if we were looking for 7 on this tree:
![Search Tree](https://res.cloudinary.com/divzjiip8/image/upload/v1572552993/Frame_1_59_gara4d.png)
- After recognizing that 7 is greater than 5, we attempt to move right, but there is no right node! We return false.

#### Your Goal: hasNode Method
- Add a method ``hasNode`` that will take a ``number`` and search our tree to find a node that has that number inside it's ``data`` property.
- If a node exists with the ``number``, return ``true``. If not return ``false``.
- For example:
```js
const tree = new Tree();
const node1 = new Node(4);

tree.addNode(node1);

console.log(tree.hasNode(4)); // true
console.log(tree.hasNode(7)); // false
```

---
**SOLUTION**
```js
// Tree.js
class Tree {
    constructor() {
        this.root = null;
    }
    addNode(node){
        if(!this.root){
            this.root = node;
        } else {
            this.addChild(this.root,node)
        }
    }
    addChild(parent, child) {
        if (child.data < parent.data) {
            if (parent.left) {
                this.addChild(parent.left, child)
            } else {
                parent.left = child
            }
        }
        if (child.data > parent.data) {
            if (parent.right) {
                this.addChild(parent.right,child)
            } else {
                parent.right = child
            }
        }
    }
    hasNode(number) {
        return this.searchNode(this.root,number)
    }
    searchNode(root,number){
        if(!root) {
            return false
        }
        if (root.data === number) {
            return true
        }
        if (root.data > number) {
            return this.searchNode(root.left,number)
        }
        if (root.data < number) {
            return this.searchNode(root.right, number)
        }
    }
}

module.exports = Tree;

// Node.js
class Node {
    constructor(data) {
        this.data = data
        this.left = null
        this.right = null
    }
}

module.exports = Node;
```
