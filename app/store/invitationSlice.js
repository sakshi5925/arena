import { createSlice } from '@reduxjs/toolkit';

const invitationSlice = createSlice({
  name: 'invitations',
  initialState: {
    receivedInvitations: [],
    acceptedInvitations:[],
  },
  reducers: {
    addInvitation(state, action) {
      state.receivedInvitations.push(action.payload);
    },
    clearInvitations(state) {
      state.receivedInvitations = [];
    },
    
    acceptInvitations(state,action){
      state.acceptedInvitations.push(action.payload);
    }
  },
});

export const { addInvitation, clearInvitations,acceptInvitations} = invitationSlice.actions;
export const invitationsReducer = invitationSlice.reducer;
