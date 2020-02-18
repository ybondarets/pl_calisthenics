enum Punctuation {
    comma = ",",
    semicolon = ";",
    openingParenthesis = "(",
    closingParenthesis = ")",
    openingBrace = "{",
    closingBrace = "}",
    openingBracket = "[",
    closingBracket = "]"
}

const isPunctuation = (symbol: string): boolean => {
    return Object.values(Punctuation).indexOf(symbol as Punctuation) >= 0;
};

export { isPunctuation };

export default Punctuation;
