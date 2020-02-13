import InputStream from "../../src/input/InputStream";

const inputText = `
#include <iostream>
#include <cmath>
using namespace std;
int main() {
    float a, b, c, x1, x2, discriminant, realPart, imaginaryPart;
    cout << "Enter coefficients a, b and c: ";
    cin >> a >> b >> c;
    discriminant = b*b - 4*a*c;
    
    if (discriminant > 0) {
        x1 = (-b + sqrt(discriminant)) / (2*a);
        x2 = (-b - sqrt(discriminant)) / (2*a);
        cout << "Roots are real and different." << endl;
        cout << "x1 = " << x1 << endl;
        cout << "x2 = " << x2 << endl;
    }
    
    else if (discriminant == 0) {
        cout << "Roots are real and same." << endl;
        x1 = (-b + sqrt(discriminant)) / (2*a);
        cout << "x1 = x2 =" << x1 << endl;
    }
    else {
        realPart = -b/(2*a);
        imaginaryPart =sqrt(-discriminant)/(2*a);
        cout << "Roots are complex and different."  << endl;
        cout << "x1 = " << realPart << "+" << imaginaryPart << "i" << endl;
        cout << "x2 = " << realPart << "-" << imaginaryPart << "i" << endl;
    }
    return 0;
}
`;

describe('InputStream test', () => {
    const createInput = (): InputStream => {
        return new InputStream(inputText);
    };

    it('create test', () => {
        const input = createInput();
        expect(input).toBeInstanceOf(InputStream);
    });

    it('current test', () => {
        const input = createInput();
        expect(input.current()).toEqual('\n');
    });

    it('next test', () => {
        const input = createInput();
        expect(input.next()).toEqual('#');
        expect(input.next()).toEqual('i');
        expect(input.next()).toEqual('n');
        expect(input.next()).toEqual('c');
        expect(input.next()).toEqual('l');
        expect(input.next()).toEqual('u');
        expect(input.next()).toEqual('d');
        expect(input.next()).toEqual('e');
    });

    it('eof test', () => {
        const input = new InputStream('two');
        expect(input.eof()).toBe(false);
        input.next();
        input.next();
        input.next();
        expect(input.eof()).toBe(true);
    });

    it('throw test', () => {
        const input = createInput();
        input.next();
        input.next();
        input.next();
        expect(() => { input.error('Error'); }).toThrowError('Error at 1:3');
    });

    it('reset test', () => {
        const input = createInput();
        input.next();
        input.next();
        input.next();
        input.next();
        input.next();
        input.reset();
        expect(input.current()).toBe('\n');
    });
});
