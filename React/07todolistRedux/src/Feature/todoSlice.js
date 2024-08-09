import { createSlice,nanoid } from "@reduxjs/toolkit";
const initialState={
    todos:[{id:1,text:"Hello Todo Text",completed:false }]
}
export const todoSlice = createSlice({
    name:'todo',
    initialState,
    reducers:{
        addTodo:(state,action)=>{
            console.log(action.payload)
            // state.todos.push({id:nanoid(),text:action.payload.text,completed:false}) //here problem is payload is directly the text one is taken
            state.todos.push({id:nanoid(),text:action.payload,completed:false})
        },
        removeTodo:(state,action)=>{
            // filter 
            state.todos = state.todos.filter((eachtodo) => action.payload.id!==eachtodo.id)
        },
        updateTodo:(state,action) => {
            state.todos = state.todos.map((eachtodo) => {
                if(eachtodo.id == action.payload.id)
                {
                    return({...eachtodo,...action.payload})    //here the things are overwrite
                }
                return eachtodo
                
            })
        },
        // //second method for update efficient maybe...
        // updateTodo: (state, action) => {
        //     const todo = state.todos.find(eachtodo => eachtodo.id === action.payload.id);
        //     if (todo) {
        //         todo.text = action.payload.text;  // Update specific fields as needed
        //         todo.completed = action.payload.completed;  // Example for updating another field
        //     }
        // }
        
        
    }
})

export const {addTodo,updateTodo,removeTodo} = todoSlice.actions

export default todoSlice.reducer     //export entire reducer