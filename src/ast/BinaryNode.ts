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
