export const PLAY = 'PLAY'
export const PAUSE = 'PAUSE'

const initialState = {
    isPlaying: false,
};

export function playerReducer (state = initialState, action = {}) {
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
        default:
            return state;
    }
};