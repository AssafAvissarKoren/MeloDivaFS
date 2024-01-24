export const SET_PLAYER_TRACK = 'SET_PLAYER_TRACK'

const initialState = {
    playedVideo: null,
}

export function trackReducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_PLAYER_TRACK:
            return {
                ...state,
                playedVideo: action.playedVideo
            }

        default:
            return state;
    }
}