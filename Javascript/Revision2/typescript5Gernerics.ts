//  generics


function auixilaryAray<T>(number:T):T[]{

    let a = [number]
    
    for (let i = 0;i<5;i++){
        a.push(number)
    }

    return a

}


auixilaryAray("A")
auixilaryAray(123)
auixilaryAray([12])



function double<T>(name:T):T{
    let a:T = JSON.parse("namer:viswgewskmfksw") 
    return a
}


// prctical using typescript in project 

// below are3 the ways to declare the librry and install if it is not deine
// прт i some-library
// прт i-D @types/some-library
// npm i-D @types/axios

