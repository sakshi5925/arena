import { createSlice } from '@reduxjs/toolkit';

const invitationSlice = createSlice({
  name: 'invitations',
  initialState: {
    receivedInvitations: [],
  },
  reducers: {
    addInvitation(state, action) {
      state.receivedInvitations.push(action.payload);
    },
    clearInvitations(state) {
      state.receivedInvitations = [];
    },
    removeInvitation(state, action) {
      state.receivedInvitations.splice(action.payload, 1);
    },
  },
});

export const { addInvitation, clearInvitations, removeInvitation } = invitationSlice.actions;
export const invitationsReducer = invitationSlice.reducer;
