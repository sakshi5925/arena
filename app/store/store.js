import { configureStore } from "@reduxjs/toolkit";
import { friendsReducer } from "./friendSlice";
export const store = configureStore({
  reducer: {
    friends: friendsReducer,
  },
});