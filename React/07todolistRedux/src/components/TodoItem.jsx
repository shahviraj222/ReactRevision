// 1.	Single State for Multiple Items: Using a single todoMsg state for all todo items doesn’t work well when you need to track the state of multiple items independently. As a result, every time you render a new todo item, the todoMsg state gets overwritten, causing unexpected behavior.
// 	2.	Assignment Inside the map Function: Assigning todoMsg = eachtodo.text inside the map function was causing todoMsg to reset for every iteration, which further compounded the problem.

// Solution Recap

// To handle the state of each todo item correctly, you can either:

// 	•	Use a more structured state (like an object) where each todo item has its own piece of state.
// 	•	Or you can update the specific state directly within the map function for each todo item.

// The primary issue was with the todoMsg state management. By switching to an approach where you maintain a separate state for each todo item (as demonstrated in the updated code), you avoid the problem of overwriting the state and ensure each todo item is independently editable.

// Key Takeaway

//Yes, the main issue was how you were handling the state with todoMsg. Switching to an approach that keeps track of individual todo item states separately (like using an object to store them) solves the problem and allows for proper state management within the list of todo items.

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateTodo, removeTodo } from '../Feature/todoSlice';

function TodoItem() {
    const [readonly, setReadonly] = useState(false);
    const [todoMsgs, setTodoMsgs] = useState({});    //important here

    const dispatch = useDispatch();
    const todos = useSelector((state) => state.todos);

    const handleUpdate = () => {
        setReadonly(prev => !prev);
    };

    const updatetitle = (e, eachtodo) => {
        e.preventDefault();
        console.log("Updated Title:", todoMsgs[eachtodo.id]);
        // Dispatch an action to update the todo item in the store
        dispatch(updateTodo({ ...eachtodo, text: todoMsgs[eachtodo.id] }));
    };

    const handleChange = (e, id) => {
        const value = e.target.value;
        setTodoMsgs(prev => ({ ...prev, [id]: value }));
    };

    return (
        <div>
            <h1>TodoItem</h1>
            <ol>
                {todos.map((eachtodo) => {
                    return (
                        <li key={eachtodo.id}>
                            <input
                                placeholder=""
                                value={todoMsgs[eachtodo.id] || eachtodo.text}    //important here
                                readOnly={!readonly}
                                onChange={(e) => handleChange(e, eachtodo.id)}
                            />
                            <button onClick={handleUpdate}>Edit</button>
                            <button onClick={(e) => updatetitle(e, eachtodo)}>Update</button>
                            <button onClick={() => dispatch(removeTodo(eachtodo))}>Delete</button>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}

export default TodoItem;