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
