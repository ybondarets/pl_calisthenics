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
