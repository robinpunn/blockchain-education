### Binary Search Tree
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

#### Creating a Node
- Let's first create the class Node, from which we will create each element inside of our tree:
![Node](https://res.cloudinary.com/divzjiip8/image/upload/v1572548951/Frame_1_50_wiuxcn.png)
- The node should contain data, which in this case is 5.
    - It should also contain references to the left child (3) and the right child (7).

#### Storing the Root
- A tree will keep track of one property: a reference to the root node.
![Root](https://res.cloudinary.com/divzjiip8/image/upload/v1572549482/Frame_1_51_x1l4si.png)

#### Adding a Root
- In this stage we'll create a new method for adding nodes to our tree.
- This is a difficult task to generalize so we'll attack it piece by piece!
- First let's start by adding a root to an empty tree.
![Root](https://res.cloudinary.com/divzjiip8/image/upload/v1572549735/Frame_1_52_gqn5ik.png)

#### First Layer
- Now it's time to focus on adding the first layer of nodes underneath our root!
- Keep the code you used to pass the last stage and then add another case for when a root already exists
![First Layer](https://res.cloudinary.com/divzjiip8/image/upload/v1572550307/Frame_1_53_vgill7.png)
- When the root already exists, we'll need to decide which side to add the new leaf node to.
    - If the new node ``data`` is **less than** the root data, we'll want to add it to the **left**.
    - Conversely, if the data is **greater** we'll add it to the **right**.

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
