import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    user:{},
    isAuthenticated:false
}

export const userSlice = createSlice({
    name:"user-data",
    initialState,
    reducers:{
        setUser:(state, action) => {
            state.user = action.payload;
            if (Object.keys(action.payload).length <= 0){
                state.isAuthenticated = false;
                return;
            }
            state.isAuthenticated = true
        },
        setAuthenticated:(state, action) => {
            state.isAuthenticated = action.payload
        }
    }
});

export const {setAuthenticated, setUser} = userSlice.actions;
export default userSlice.reducer