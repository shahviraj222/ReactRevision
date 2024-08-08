import { useState } from "react"
import { TodoProvider } from "./contexts/TodoContext"


function App() {
  
  const [todos,setTodo] = useState([])

  const addTodo = (todo)=>{
    // ... this spred any object ot array
    setTodo((prev) => ([...prev,{id:Date.now(),...todo}]))
  }
  
  const updateTodo = (todo,id) => {
    setTodo((prev) => prev.map((eachtodo) => eachtodo.id == id ?todo :eachtodo ))
  }
  
  const deleteTodo = (id) =>{
    //filter only return in true condition In false it return nothing
    setTodo((prev) => prev.filter((eachtodo) => eachtodo.id !== id ))
  }

  const toggleComplete = (id) => {
    // over written if id is matched for few variables
    setTodo((prev) => prev.map((eachtodo) => eachtodo.id == id ? {...eachtodo,completed:!eachtodo.completed} : eachtodo))
  }

  return (
    <TodoProvider value={{todos,addTodo,updateTodo,deleteTodo,toggleComplete}}>
    <div className="bg-[#172842] min-h-screen py-8">
      <div className="w-full max-w-2xl mx-auto shadow-md rounded-lg px-4 py-3 text-white">
        <h1 className="text-2xl font-bold text-center mb-8 mt-2">Manage Your Todos</h1>
        <div className="mb-4">
          {/* Todo form goes here */}
        </div>
        <div className="flex flex-wrap gap-y-3">
          {/*Loop and Add TodoItem here */}
        </div>
      </div>
    </div>
    </TodoProvider>
  )
}

export default App
