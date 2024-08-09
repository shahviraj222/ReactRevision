import { useState } from 'react'
import {Provider} from 'react-redux'
import { store } from './app/store'
import TodoForm from './components/TodoForm'
import TodoItem from './components/TodoItem'

function App() {
  
  return (
    <>
      <Provider store={store}>
        <h1>Hello React Redux toolkit</h1>
        <TodoForm/>
        <TodoItem/>
      </Provider>
    </>
  )
}

export default App
