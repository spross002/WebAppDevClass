//Functions in JavaScript are very flexible
const foo = function (x){
    console.log("hello " + x);

    if(x == 9){
        return 5;
    }

    return "hello " + x;
}

//Another example
const squared = function(x){
    return x * x;
}

console.log(squared(5));

//Although, because JavaScript is a loose language, it will let you do this:
console.log(squared("hello"));
console.log(squared());
console.log("-----------------");
//Both of the above will return NaN
//In order to prevent these, you need to adjust the function, for example
// adding an if-statement like if(x === undefined) return -1;

//There isnt anything to stop a user from calling more arguments than intended.
// To help with this, we can use the "arguments" calling.
//      For example if(arguments.length > 1) do something;

//Functions can also be used as parameters.
const printOpResult = function(x, y, f){
    const result = f(x, y);
    console.log(result);
}

const other_function = function(){
    const z = 15;
    printOpResult(5, 3, function(x, y){
        return x + y + z;
    });
};

other_function(); //This returns 23