enum Operator {
    multiple = "*",
    divide = "/",
    power = "^",
    less = "<",
    more = ">",
    assign = "=",
    plus = "+",
    minus = "-",
    and = "&",
    or = "|",
    not = "!",
    modulus = "%"
}


const isOperator = (symbol: string): boolean => {
    return Object.values(Operator).indexOf(symbol as Operator) >= 0;
};

export { isOperator };

export default Operator;
