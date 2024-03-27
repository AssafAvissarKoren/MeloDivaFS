export const SET_ID = "SET_ID"
export const SET_NAME = "SET_NAME"
export const SET_IMG = "SET_IMG"
export const SET_IS_ADMIN = "SET_IS_ADMIN"

export const SET_LIKED_TRACKS = "SET_LIKED_TRACKS"
export const ADD_LIKED_TRACK = "ADD_LIKED_TRACK"
export const REMOVE_LIKED_TRACK = "REMOVE_LIKED_TRACK"

export const SET_IS_LOADING = "SET_IS_LOADING"

const initialState = {
    _id: null,
    fullname: null, 
    imgUrl: null,
    likedTracks: {},
    isAdmin: false,
}

export function userReducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_ID:
            return {
                ...state,
                _id: action._id
            }
        case SET_NAME:
            return {
                ...state,
                fullname: action.fullname
            }
        case SET_IMG:
            return {
                ...state,
                imgUrl: action.imgUrl
            }
        case SET_IS_ADMIN:
            return {
                ...state,
                isAdmin: action.isAdmin
            }
        case SET_LIKED_TRACKS:
            return {
                ...state,
                likedTracks: { ...action.likedTracks }
            }
        case ADD_LIKED_TRACK:
            return {
                ...state,
                likedTracks: { ...state.likedTracks, [action.track.url]: action.track }
            }
        case REMOVE_LIKED_TRACK:
            let tracks = {...state.likedTracks}
            delete tracks[action.track.url]
            return {
                ...state,
                likedTracks: tracks
            }
        case SET_IS_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            }
        default:
            return state;
    }
}