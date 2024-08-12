import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    status: false,
    userData: null
}
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData; //in this state.userData you don't have to spred data it will done by it self.
        },

        logout: (state, action) => {
            state.status = false;
            state.userData = null;
        }

    }
})

export const { login, logout } = authSlice.actions;
export default authSlice;