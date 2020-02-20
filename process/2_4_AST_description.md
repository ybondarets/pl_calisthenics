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

To enumerate nodectypes create `src/ast/NodeType.ts`:
```typescript
enum NodeType {
    String = "String",
    Number = "Number",
    Boolean = "Boolean",
    Identifier = "Identifier",
    Function = "Function",
    Call = "Call",
    If = "If",
    Assign = "Assign",
    Binary = "Binary",
    Sequence = "Sequence"
}

export default NodeType;
```

In my opinion - code is the best description.
Create `src/ast/AbstractNode.ts`:
```typescript
import NodeType from "./NodeType";

export default abstract class AbstractNode {
    private type: NodeType;

    public constructor(type: NodeType) {
        this.type = type;
    }

    public getType(): NodeType {
        return this.type;
    }
}
```

It's looks like concrete class but I defined him like
abstract not by mistake. By itself it has no sense, we can't do any 
king of stuff only according to the node type but it's general 
thing of all nodes.

Now we can define scalar node types, i will start from `src/ast/StringNode.ts`:
```typescript
import NodeType from "./NodeType";
import AbstractNode from "./AbstractNode";

/**
 * "some text"  -> { type: "String", value: "some text" }
 */
export default class StringNode extends AbstractNode {
    private value: string;

    public constructor(value: string = "") {
        super(NodeType.String);

        this.value = value;
    }

    public getValue(): string {
        return this.value;
    }
}
```

As you see it's simple implementation to store some data, we can quickly
continue in the same way with `NumberNode`, `IdentifierNode` and `BooleanNode`.

`src/ast/NumberNode.ts`:
```typescript
import NodeType from "./NodeType";
import AbstractNode from "./AbstractNode";

/**
 * 1234.567  -> { type: "Number", value: 1234.567 }
 */
export default class NumberNode extends AbstractNode {
    private value: number;

    public constructor(value: number) {
        super(NodeType.Number);

        this.value = value;
    }

    public getValue(): number {
        return this.value;
    }
}
```

And pretty same `src/ast/IdentifierNode.ts`:
```typescript
import NodeType from "./NodeType";
import AbstractNode from "./AbstractNode";

/**
 * num  -> { type: "Identifier", value: num }
 */
export default class IdentifierNode extends AbstractNode {
    private value: string;

    public constructor(value: string = "") {
        super(NodeType.Identifier);

        this.value = value;
    }

    public getValue(): string {
        return this.value;
    }
}
```
 
It were scalar node types with type and value properties, now we can describe more complex
node types. Binary node is little bit more complex than scalar node type
because it will contains more properties `src/ast/BinaryNode.ts`:

```typescript
import NodeType from "./NodeType";
import AbstractNode from "./AbstractNode";
import Operator from "../syntax/Operator";

/**
 * a + 2; -> {type: "Binary"; operator: "+", left: { type: "Identifier"; value: "a" }; right: { type: "Number"; value: 2}}
 */
export default class BinaryNode extends AbstractNode {
    private operator: Operator;
    private left: AbstractNode;
    private right: AbstractNode;

    public constructor(operator: Operator, left: AbstractNode, right: AbstractNode) {
        super(NodeType.Binary);

        this.operator = operator;
        this.left = left;
        this.right = right;
    }

    public getOperator(): Operator {
        return this.operator;
    }

    public getLeft(): AbstractNode {
        return this.left;
    }

    public getRight(): AbstractNode {
        return this.right;
    }
}
```

Next one will be partial case of `BinaryNode`,
`src/ast/AssignNode.ts`:
```typescript
import NodeType from "./NodeType";
import AbstractNode from "./AbstractNode";

/**
 * a = 2; -> {type: "Assign"; left: { type: "Identifier"; value: "a" }; right: { type: "Number"; value: 2}}
 */
export default class BinaryNode extends AbstractNode {
    private left: AbstractNode;
    private right: AbstractNode;

    public constructor(left: AbstractNode, right: AbstractNode) {
        super(NodeType.Assign);

        this.left = left;
        this.right = right;
    }

    public getLeft(): AbstractNode {
        return this.left;
    }

    public getRight(): AbstractNode {
        return this.right;
    }
}
```

Here is a sweet part of out language, function description `src/ast/FunctionNode.ts`
```typescript
import NodeType from "./NodeType";
import AbstractNode from "./AbstractNode";

/**
 * f(x, y) x + y + 1; -> {type: "Function", args: ["x", "y"], body: { type: "Binary"; left: { type: "Identifier", value: "x" }; right: {
 *     type: "Binary",
 *     left: {type: "Identifier"; value: "y"},
 *     right: {type: "Number", value: 1}
 * }}}
 */
export default class FunctionNode extends AbstractNode {
    private body: AbstractNode;
    private args: Array<string>;

    public constructor(body: AbstractNode, args: Array<string> = []) {
        super(NodeType.Function);

        this.body = body;
        this.args = args;
    }

    public getBody(): AbstractNode {
        return this.body;
    }

    public getArgs(): Array<string> {
        return this.args;
    }
}
```

When we have function, we have what to call, and to do it we have to 
implement `src/ast/CallNode.ts`:

```typescript
import NodeType from "./NodeType";
import AbstractNode from "./AbstractNode";

/**
 * a(1, b) -> { type: "Call", args: [{type: "Number", value: 1}, {type: "Identifier", value: "b"}], func: {type: "Identifier", value: "a"} }
 */
export default class CallNode extends AbstractNode {
    private args: Array<AbstractNode>;
    private func: AbstractNode;

    public constructor(args: Array<AbstractNode>, func: AbstractNode) {
        super(NodeType.Call);
        this.args = args;
        this.func = func;
    }

    public getArguments(): Array<AbstractNode> {
        return this.args;
    }

    public getFunction(): AbstractNode {
        return this.func;
    }
}
``` 

Most real-life programs need to conditional statements,
so here is `src/ast/IfNode.ts`:
```typescript
import NodeType from "./NodeType";
import AbstractNode from "./AbstractNode";

/**
 * if a then 2 else b -> {
  "type": "If",
  "condition": { "type": "Identifier", "value": "foo" },
  "then": { "type": "Number", "value": 2 },
  "other": { "type": "Identifier", "value": "b" }
}
 */
export default class CallNode extends AbstractNode {
    private then: AbstractNode;
    private other: AbstractNode;
    private condition: AbstractNode;

    public constructor(condition: AbstractNode, then: AbstractNode, other: AbstractNode) {
        super(NodeType.If);

        this.condition = condition;
        this.then = then;
        this.other = other;
    }

    public getCondition(): AbstractNode {
        return this.condition;
    }

    public getThen(): AbstractNode {
        return this.then;
    }

    public getElse(): AbstractNode {
        return this.other;
    }
}
```

It's almost done but we need implement final one - `src/ast/SequenceNode.ts`,
it will describe sequence of nodes, basically every program is a sequence:

 ```typescript
import NodeType from "./NodeType";
import AbstractNode from "./AbstractNode";

/**
a = {
c = 13;
b = 12;
c * b
}; - {
    type: "Sequence",
    nodes: [
        {
            type: "Assign",
            left: {
                type: Identifier,
                value: "c"
            },
            right: {
                type: "Number",
                value: 13
            }
        },
        {
            type: "Assign",
            left: {
                type: Identifier,
                value: "b"
            },
            right: {
                type: "Number",
                value: 12
            }
        },
        {
            type: "Binary",
            operator: "*",
            left: {
                type: Identifier,
                value: "c"
            },
            right: {
                type: "Identifier",
                value: "b"
            }
        },
    ]
}
 */
export default class SequenceNode extends AbstractNode {
    private nodes: Array<AbstractNode>;

    public constructor(nodes: Array<AbstractNode>) {
        super(NodeType.Sequence);

        this.nodes = nodes;
    }

    public getNodes(): Array<AbstractNode> {
        return this.nodes;
    }
}
```

Basically it all about our AST description, probably we will add something to it
in the future but for now it will be enough.

In the next part we will create parser to transform tokens list to the AST.
See you later.
