enum Punctuation {
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
    return Object.values(Punctuation).indexOf(symbol as Punctuation) >= 0;
};

export { isOperator };

export default Punctuation;
