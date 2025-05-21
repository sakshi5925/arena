import { configureStore } from "@reduxjs/toolkit";
import { friendsReducer } from "./friendSlice";
import { invitationsReducer } from './invitationSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from "redux";
import { RoomsReducer } from "./roomsSlice";
const persistConfig = {
  key: "root",
  storage,
};
const rootReducer = combineReducers({
  friends: friendsReducer,
  invitations: invitationsReducer,
  Rooms:RoomsReducer
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});
export const persistor = persistStore(store);