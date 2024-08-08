import { useEffect, useState } from "react"
import { TodoProvider } from "./contexts/TodoContext"
import TodoForm from "./components/TodoForm"
import TodoItem from "./components/TodoItem"


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

  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem("todos"))
    console.log(todos)
    if(todos)
    {
      setTodo(todos)
    }
  },[])

  useEffect(() => {
    localStorage.setItem("todos",JSON.stringify(todos))
  },[todos,setTodo])

  useEffect(()=>{
    console.log(todos)
  },[todos,setTodo])
  return (
    <TodoProvider value={{todos,addTodo,updateTodo,deleteTodo,toggleComplete}}>
    <div className="bg-[#172842] min-h-screen py-8">
      <div className="w-full max-w-2xl mx-auto shadow-md rounded-lg px-4 py-3 text-white">
        <h1 className="text-2xl font-bold text-center mb-8 mt-2">Manage Your Todos</h1>
        <div className="mb-4">
          <TodoForm/>
        </div>
        <div className="flex flex-wrap gap-y-3">
          {
            todos.map((todo)=><TodoItem key={todo.id} todo={todo}/>)
          }
        </div>
      </div>
    </div>
    </TodoProvider>
  )
}

export default App
