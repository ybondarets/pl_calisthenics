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
