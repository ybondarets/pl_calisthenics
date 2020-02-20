import NodeType from "./NodeType";
import AbstractNode from "./AbstractNode";

/**
 * true  -> { type: "Boolean", value: true }
 * false  -> { type: "Boolean", value: false }
 */
export default class BooleanNode extends AbstractNode {
    private value: boolean;

    public constructor(value: boolean) {
        super(NodeType.Boolean);

        this.value = value;
    }

    public getValue(): boolean {
        return this.value;
    }
}
