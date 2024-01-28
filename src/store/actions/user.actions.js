import { userService } from "../../services/user.service";
import { SET_ID, SET_NAME, SET_IMG, SET_LIKED_TRACKS, ADD_LIKED_TRACK, REMOVE_LIKED_TRACK } from "../reducers/user.reducer";
import { store } from "../store";

export async function initUser() {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    try {
        const user = await userService.getUser()
        const { _id, fullname, imgUrl, likedTracks} = user
        store.dispatch({ type: SET_ID, _id })
        store.dispatch({ type: SET_NAME, fullname })
        store.dispatch({ type: SET_IMG, imgUrl })
        store.dispatch({ type: SET_LIKED_TRACKS, likedTracks })
    } catch (err) {
        console.log('Had issues Initalizing liked tracks', err);
        throw err
    } finally {
        // store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    }
} 

export function toggleLikedTrack(track) {
    const user = store.getState().userModule
    if(user.likedTracks[track.url]) removeLikedTrack(user, track)
    else addLikedTrack(user, track)
}

async function addLikedTrack(user, track) {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    try {
        console.log({...user, likedTracks: {...user.likedTracks, [track.url]: track}})
        userService.setUser({...user, likedTracks: {...user.likedTracks, [track.url]: track}})
        store.dispatch({ type: ADD_LIKED_TRACK, track })
    } catch (err) {
        console.log('Had issues Adding station', err);
        throw err
    } finally {
        // store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    }
}

async function removeLikedTrack(user, track) {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    let likedTracks = {...user.likedTracks}
    delete likedTracks[track.url]
    try {
        userService.setUser({...user, likedTracks: likedTracks})
        store.dispatch({ type: REMOVE_LIKED_TRACK, track })
    } catch (err) {
        console.log('Had issues Removing station', err);
        throw err
    } finally {
        // store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    }
}