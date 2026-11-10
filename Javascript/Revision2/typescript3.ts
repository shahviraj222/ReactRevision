// 11 Enum

enum Sizes{
    xl = 20,
    xxl = 40,
    xxxl = 60
}

function deliverTshirt(size:Sizes){
    console.log("Your tshirt is delivered of size:",size)

}

deliverTshirt(Sizes.xxxl)

