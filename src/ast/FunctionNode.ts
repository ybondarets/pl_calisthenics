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
