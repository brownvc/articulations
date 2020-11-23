import Constants from '../util/Constants';
import postWithUsername from './postWithUsername';

export const startSessionAPI = () => postWithUsername(`${Constants.baseURL}/articulation-program/session/start`, {});

export const endSessionAPI = (sessionID, name, comments) => postWithUsername(`${Constants.baseURL}/articulation-program/session/end`, {
  session_id: sessionID,
  session_name: name,
  comments,
});
