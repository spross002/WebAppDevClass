var x = NaN;
var y = 5;

var z = Infinity;
if(x < z){
    console.log("x is less");
}

console.log(z);
z = "hello";
z += "world";
console.log(z);

console.log(x + y);

//Important: === "means equal in value and type" - no casting. 
// == means "equal, with an effort to cast" i.e. it casts the type first for comparison
console.log(x === NaN);
if(Number.isNaN(x)){
    console.log("YES");
}

//Note: this will just convert the 6 to a string, because that is easier than parsing the string
console.log("5" + 6);

//In this case, it will cast "5" to a number because of the multiplication
console.log("5" * 6);

//However, this case will return NaN
console.log("hello" + 6);