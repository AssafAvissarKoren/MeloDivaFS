import { UPDATE_STATE_AND_STORAGE } from '../constants/actionTypes';

const initialState = {
    // initial state here
};

export const emailReducer = (state = initialState, action) => {
    switch (action.type) {
      case UPDATE_STATE_AND_STORAGE:
        const { updatedEmail, isReRender } = action.payload;
        // Add logic to handle the update here
        return {
          ...state,
          // ... your updated state
        };
      default:
        return state;
    }
  };
  