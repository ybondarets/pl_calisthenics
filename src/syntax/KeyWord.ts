enum KeyWord {
    if = "if",
    else = "else",
    then = "then",
    f = "f",
    true = "true",
    false = "false"
}

const isKeyWord = (word: string): boolean => {
    return word in KeyWord;
};

export { isKeyWord };

export default KeyWord;
