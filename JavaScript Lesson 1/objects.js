// const foo = {}; <-- same thing as const foo = new Object();
// Can also use const foo = Object.create(null);
//      Ex: Object.create(a: 1, b: 2);

//Note: JSON means JavaScript Object Notation

const foo = {
    a: 4, 
    b: 5, 
    c: "hello",
    parent:{ //This is called "nesting"
        child_a: "A",
        child_b: "B"
    },
    list: [1, 2, 3, 4]
};

foo.d = "This is new";

console.log(foo.a);
//Note: console.log(foo['a']) would be the same as console.log(foo.a))

const prop = 'a';
console.log(foo[prop]);

//Most of the time people do this when removing from an object, although it will return undefined
// if the object is looked for
foo.b = undefined;
console.log(foo);

//Although, you can do this and delete the value in the object
delete foo.b;
console.log(foo);

//The "in" property checks if the listed thing is in the object
if("a" in foo){
    console.log("a is still in the object");
}

//This is basically just saying bar is going to point to the same object as foo
//const bar = foo;

//How to clone an object
const bar = JSON.parse(JSON.stringify(foo));

foo.a = 17;
console.log(bar.a);

console.log(JSON.stringify(foo, null, 2));