const promise1 = new Promise(function(resolve,reject){
    setTimeout(function(){
        error=true
        if(error){
            reject("Rejected")
        }
        resolve({name:"VirajShah"})
        console.log("promise1 is runing")
    },1000)
})

promise1.then(function(user){
   console.log("promise consumed")
   return user.name;1
})
.then(function (username){
    console.log(username)
})
.catch(function(error){
    console.log(error)
    return "username"
})
.then(function (username){
    console.log(username)
})



