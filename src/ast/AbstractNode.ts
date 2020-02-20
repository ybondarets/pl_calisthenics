import NodeType from "./NodeType";

export default abstract class AbstractNode {
    private type: NodeType;

    public constructor(type: NodeType) {
        this.type = type;
    }

    public getType(): NodeType {
        return this.type;
    }
}
