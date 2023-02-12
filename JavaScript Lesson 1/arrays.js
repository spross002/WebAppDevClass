//Arrays can store almost anything
const arr = [5, 6, [7, 8], {a: 3, b: 9}];

console.log(arr[2][1]);
console.log(arr[3]);
console.log(arr[3].b);

//JavaScript doesn't actually preallocate arrays, but you basically can
const fakePreAlloc = new Array(10);
console.log(fakePreAlloc); // This would return [<10 empty items>]

fakePreAlloc[400] = "hello";
console.log(fakePreAlloc[400]);
console.log(fakePreAlloc); // This would return [<400 empty items>, 'hello']

//Arrays are objects and have properties
//For example you can do:
fakePreAlloc.four = 14; // <-- This adds (four: 14) to the array, but doesn't count towards length

//Arrays can also be thought of as stacks, and have tons of methods in them
//For example .push() and .pop() works with arrays

//When going through an array "let i in array" will just access declared indexes in the array
//However, the "let value of array" will access all indexes

//You can search for a value in an array with indexOf - it returns the index of the value
//  If not found, returns -1