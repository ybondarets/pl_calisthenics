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
