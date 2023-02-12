/*
    var - the original variable declaration. Can be reassigned, and is function scoped.
    
    Note: using var only declares in that function scope. 

    var x = 10;
*/

/*
    const - newer, non-reassignable variable. Block scoped (meaning it is tied to the block it is in)
          - the block it is in is defined by {}.
          - the variable value cannot be changed

    let - newer, and preferred way to declare re-assignable variables.
        - pretty much the same thing as var, but is BLOCK scoped. (Stays in {})
    
*/

function foo(){
    // x = 9; <-- this would declare x in the global scope
    var x = 9; // <-- this declares x in the function scope
    if(x < 10){
        var y = 10;
    }
    //y is available
    //this doesn't return an error because "y" is technically declared in the if statement,
    // even if it doesn't run.
    console.log(y);
}

foo();

//Use "let" in for loops
for(let i = 0; i < 10; i++){
    console.log(i);
}