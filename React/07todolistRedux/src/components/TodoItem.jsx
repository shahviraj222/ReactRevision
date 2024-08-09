import React from 'react';
import { useSelector } from 'react-redux';

function TodoItem(props) {

    // here selector provide you state which can be called in callback and then we access any thing in store
    const todos = useSelector((state) => state.todos)
    return (
        <div>
            <h1>TodoItem</h1>
            <list>
             {todos.map((eachtodo)=> 
                <ul key={eachtodo.key} >{eachtodo.text}</ul>
            )}
            </list>
        </div>
    );
}

export default TodoItem;