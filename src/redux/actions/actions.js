import { UPDATE_STATE_AND_STORAGE } from '../constants/actionTypes';

export const updateStateAndStorageAction = (updatedEmail, isReRender) => ({
  type: UPDATE_STATE_AND_STORAGE,
  payload: { updatedEmail, isReRender },
});
