import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../Feature/todoSlice';
function TodoForm(props) {
    const [input,setInput] = useState("")
    const dispatch =useDispatch()
    function addHandler(e){
        e.preventDefault()
        // using dispatch you are sending the value to the store 
        // here we are calling the addTodo methode which is store > reducers and passing payload
        dispatch(addTodo(input))
        setInput("")

    }
    return (
        <div>
            <form onSubmit={addHandler}>
                <input type="text"
                       placeholder='enter todo'
                       value={input}
                       onChange={(e) => setInput(e.target.value)} 
                />
                <button type="submit">AddToDo</button>
            </form>
        </div>
    );
}

export default TodoForm;