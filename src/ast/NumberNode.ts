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
