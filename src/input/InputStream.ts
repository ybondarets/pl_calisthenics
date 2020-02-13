export default class InputStream {
    private source: string;
    private position: number = 0;
    private column: number = 0;
    private line: number = 1;

    public constructor(source: string = '') {
        this.source = source;
    }

    public current(): string {
        return this.source.charAt(this.position);
    }

    public next(): string {
        this.position++;
        const symbol = this.current();

        if (symbol === '\n') {
            this.line++;
            this.column = 0;
        } else {
            this.column++;
        }

        return symbol;
    }

    public eof(): boolean {
        return this.current() === '';
    }

    public error(message: string = ''): void {
        throw new Error(`${message} at ${this.line}:${this.column}`);
    }

    public reset(): void {
        this.position = 0;
        this.column = 0;
        this.line = 1;
    }
}
