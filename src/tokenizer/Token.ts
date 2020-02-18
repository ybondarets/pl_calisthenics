import TokenType from "./TokenType";

export default class Token {
    private type: TokenType;
    private value: any;

    public constructor(type: TokenType, value: any) {
        this.validateType(type);
        this.type = type;
        this.value = value;
    }

    public getType(): TokenType {
        return this.type;
    }

    public getValue(): any {
        return this.value;
    }

    private validateType(type: TokenType) {
        if (!(type in TokenType)) {
            throw new Error('Token type should be one of "TokenType"');
        }
    }
}
