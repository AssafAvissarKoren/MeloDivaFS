export const PLAY = 'PLAY'
export const PAUSE = 'PAUSE'
export const SHUFFLE = 'SHUFFLE'
export const LOOP = 'LOOP'

const initialState = {
    isPlaying: false,
    isShuffle: false,
    isLooping: false,
};

export function playerReducer (state = initialState, action = {}) {
    console.log(state)
    switch (action.type) {
        case 'PLAY':
            return {
                ...state,
                isPlaying: true,
            };
        case 'PAUSE':
            return {
                ...state,
                isPlaying: false,
            };
        case 'SHUFFLE':
            return {
                ...state,
                isShuffle: action.isShuffle,
            };
        case 'LOOP':
            return {
                ...state,
                isLooping: action.isLooping,
            };
        default:
            return state;
    }
};