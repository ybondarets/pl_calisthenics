# AST description

First of all AST is a tree representation of the abstract syntactic structure of source code.
We have root node and leafs that can be root of other leaf.
Tree structure is very useful to to processed languages
because it's give us possibility to easy traverse nodes,
transform them and allow to work with one leaf as with whole
structure and with structure like with one leaf.

Core requirements include the following:

* Variable types must be preserved, as well as the location of each declaration in source code. 
    _(for now I will ignore second part of condition, it's easy to implement if you want)_
* The order of executable statements must be explicitly represented and well defined.
* Left and right components of binary operations must be stored and correctly identified.
* Identifiers and their assigned values must be stored for assignment statements. 

To describe current language semantic 
we need to have following list of nodes.

* String
* Number
* Boolean
* Identifier
* Function
* Call
* If
* Assign
* Binary
* Sequence

We can group some kind of nodes,
String, Number, Boolean, Identifier - are scalars, it's mean that they 
will contains only value.

Sequence will be a node with list of other nodes.

Binary is a node with left and right operands and operator.

Assign will be a partial case of Binary with `=` operator, it's okay in this case
to handle it easier.

Functions is a salt of our language, it will be node with
argument names and body, body is a AST.

**If** is a conditional operator's node that contains 
condition which will be AST because it can be computed and
`then`, `else` AST properties.

And last one and hardest for me is a Call node
It's contains function to execute and arguments to pass.

In my opinion - code is the best description.

