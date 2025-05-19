import { configureStore } from "@reduxjs/toolkit";
import { friendsReducer } from "./friendSlice";
import { invitationsReducer } from './invitationSlice';

export const store = configureStore({
  reducer: {
    friends: friendsReducer,
    invitations: invitationsReducer,
  },
});