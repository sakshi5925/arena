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
      state.receivedInvitations=state.receivedInvitations.filter((inv)=>inv.id!==action.payload.id)
    },
    declineInvitation(state, action) {
      state.receivedInvitations = state.receivedInvitations.filter(
        (inv) => inv.id !== action.payload.id
      );
    },
  },

});

export const { addInvitation,
  clearInvitations,
  acceptInvitations,
  declineInvitation,} = invitationSlice.actions;
export const invitationsReducer = invitationSlice.reducer;
