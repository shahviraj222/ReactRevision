// 5 special values according to your chooise
let abc: string| number = "viraj"
let seatchoise : "alise" | "middle" | "window" = "alise"

// 6 Gardling Or Narrrowing

let st: string | number = 234

if (typeof st === "string"){v
    console.log("I am String")
}

else {
    console.log("I am number")
}

// 7 Type

type masalachai={
    type:"masala",
    level:number
}

type gingerchai ={
    type:"ginger",
    power:number
}

type eliachai ={
    type:"eliachi",
    aroma: "strong" | "normal"
}

type chai = masalachai | eliachai | gingerchai
type response = "normal" | "eliachai" | "ginere"

function getOrder(userres:response):chai{
    let orderedchai:chai
    switch (userres) {
        case "eliachai": 
        orderedchai =   { type : "eliachi",aroma:"normal" }    
            break;

        case"ginere" : 
        orderedchai =   { type : "ginger",power:23 }    
            break;
            
        default:
             orderedchai =   { type:"masala", level:234 } 
    }
return orderedchai
}


// 8 Type Assertion
// Force fully delcraign thae value of the type script


type book = {name:string,content:Object}

function getallbook_Library():book{
     
    // doing database query and evething
    let databaseReturn= "{we have the return value from database sotred here}" 
    let book = JSON.parse(databaseReturn) as book    //here we are saying type scirpot that hey this function retunr book type manle maine bola hai 
    return book

}


let beta:unknown = "how you feel after becoming billion" 

let upper:string = beta as string 


// 9 Interfaces:
// why we need the interface if we have the type both are the same as if we see
// because the class can not easily used the type (specially when you want to use with the personalised vlaues)
// so for thaty particular thing we neeed the interface 

interface cupsize {
    size : "small" | "large"
}

class chaimaking implements cupsize{
    size: "small" | "large" = "small"
}




// this is why we need interface it gives error
type examples ={
    name: "Viraj" | "vimal"
    value: 25| 20
}

class marks implements examples {
    name: "Viraj" | "vimal" = "Viraj"
}


