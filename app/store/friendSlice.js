import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const fetchMyFriends = createAsyncThunk(
  'friends/fetchMyFriends',
  async (userName, thunkAPI) => {
    const res = await fetch(`/api/users/friends?userId=${userName}`);
    const data = await res.json();
    return data;
  }
);

const friendsSlice = createSlice({
  name: 'friends',
  initialState: {
    myFriends: [],
    nonFriends: [],
    status: 'idle',  // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    setNonFriends(state, action) {
      state.nonFriends = action.payload;
    },
    addFriend(state, action) {
      state.myFriends.push(action.payload);
      // Optionally remove from nonFriends if exists
      state.nonFriends = state.nonFriends.filter(f => f._id !== action.payload._id);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchMyFriends.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMyFriends.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.myFriends = action.payload;
      })
      .addCase(fetchMyFriends.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { setNonFriends, addFriend } = friendsSlice.actions;

export const friendsReducer = friendsSlice.reducer;
