function f (a, b) {
    c = a + b;
    a = 4;
    return c * 2;

}

var a = 1, b = 1, c = 1, d;
d = f (a, b, c);
console.log(a);