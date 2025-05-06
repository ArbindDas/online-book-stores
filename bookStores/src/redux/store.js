import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { RESET_LOGOUT } from "../utils/constants";
import userReducer from "./slices/userSlices";
import cartReducer from "./slices/cartSlice";

const appReducer = combineReducers({
    user: userReducer,
    cart:cartReducer
});

const rootReducer = (state, action) => {
  if (action.type === RESET_LOGOUT) {
    return appReducer(undefined, action);
  } else {
    return appReducer(state, action);
  }
};

export const store = configureStore({
  reducer: rootReducer,
});
