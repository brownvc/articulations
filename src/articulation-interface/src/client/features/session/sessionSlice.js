/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { startSessionAPI, endSessionAPI } from '../../api/sessions';

const initialState = {
  sessionID: undefined,
  endingSession: false,
};

const sessionSlice = createSlice({
  name: 'sessionSlice',
  initialState,
  reducers: {
    setSessionID(state, action) {
      state.sessionID = action.payload;
    },
    setEndingSession(state, action) {
      state.endingSession = action.payload;
    }
  }
});

export default sessionSlice.reducer;
export const {
  setSessionID,
  setEndingSession,
} = sessionSlice.actions;

export const startSession = () => async (dispatch) => {
  try {
    const res = await startSessionAPI();
    if (res.ok) {
      const { result } = await res.json();
      localStorage.setItem('sessionID', result.session_id);
      dispatch(setSessionID(result.session_id));
    }
  } catch (err) {
    console.error(err);
  }
};

export const endSession = (sessionID, name, comments) => async (dispatch) => {
  dispatch(setEndingSession(false));
  try {
    const res = await endSessionAPI(sessionID, name, comments);
    if (res.ok) {
      localStorage.removeItem('sessionID');
      dispatch(setSessionID(undefined));
    } else {
      alert('Could not end session. See the console for more details.');
    }
  } catch (err) {
    console.error(err);
    alert('Could not end session. See the console for more details.');
  }
};
