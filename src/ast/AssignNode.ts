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
