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
