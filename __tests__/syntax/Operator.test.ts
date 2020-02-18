import Operator, { isOperator } from "../../src/syntax/Operator";

describe('Operator test', () => {
    it('not Operator test', () => {
        expect(isOperator('abra')).toBe(false);
    });

    it('is Operator test', () => {
        expect(isOperator("*")).toBe(true);
        expect(isOperator("/")).toBe(true);
        expect(isOperator("^")).toBe(true);
        expect(isOperator("<")).toBe(true);
        expect(isOperator(">")).toBe(true);
        expect(isOperator("=")).toBe(true);
        expect(isOperator("+")).toBe(true);
        expect(isOperator("-")).toBe(true);
        expect(isOperator("&")).toBe(true);
        expect(isOperator("|")).toBe(true);
        expect(isOperator("!")).toBe(true);
        expect(isOperator("%")).toBe(true);
        expect(isOperator(Operator.divide)).toBe(true);
    });
});
