import { createSlice } from '@reduxjs/toolkit';

const RoomsSlice = createSlice({
  name: 'Rooms',
  initialState: {
    roomsCreated: [],
    
  },
  reducers: {
    addRoom(state, action) {
      state.roomsCreated.push(action.payload);
    },
  },
});

export const { addRoom} = RoomsSlice.actions;
export const RoomsReducer = RoomsSlice.reducer;
