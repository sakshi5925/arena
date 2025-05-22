import { createSlice } from '@reduxjs/toolkit'

const roomSlice = createSlice({
  name: 'room',
  initialState: {
    room: false,
     roomid: null,
  },
  reducers: {
    setRoom(state, action) {
       state.room = action.payload.room;
       state.roomid = action.payload.roomid;  
    },
  },
});

export const { setRoom } = roomSlice.actions;
export const roomReducer= roomSlice.reducer;
