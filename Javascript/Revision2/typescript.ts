// Type Aliase and the Other is interface

// 1 Interface
// interface ToolResult {
//   result: Boolean;
//   msg: String;
//   tools: Object;
// };

// TypeAliase

type ToolResult = {
  result: boolean;
  msg: string;
  tools: object;
};

function getWeather(cordinaton:string):ToolResult|boolean|null{

  if (cordinaton){
    let x = {result:false,msg:"not able to find the weather ",tools:{name:"apxwather api"}}

    return x
  }
  return false

}


async function excuteTool(name : String):Promise<void>{
  
  let cord:string | null = ""
  let promise = new Promise(resolve=>{
    let restult  = getWeather(cord)

  if (restult){
    console.log("Run is succesfull")
  }
  })
 
  return 

}

// 3 Type Uninon

let a : string | Number | null | undefined 

let b: unknown

// 4 Type narrowing

if (typeof a == "string"){
  console.log(a.toLocaleLowerCase)
}

