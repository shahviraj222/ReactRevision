class chais{
    flavour:string
    price:number

    constructor(flavour:string,price:number){
        this.flavour = flavour
        this.price = price
    }
}

let newchais = new chais("ginger",234)


// Nothing special check the oops concept only 

// interface usagea 

interface funtype{
    start():void
    stop():void
    
}

let basic:funtype = {
    start(){

    },

    stop(){

    }

}

// signature in the typescript

interface rating {
    [flavour:string]:number

}

let abc:rating = {
    "masala":453,
    "milkfat":1232,
    "ginger":1234,
    "water":123
}

