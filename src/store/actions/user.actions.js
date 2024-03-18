import { eventBusService } from "../../services/event-bus.service";
import { stationService } from "../../services/station.service";
import { userService } from "../../services/user.service";
import { utilService } from "../../services/util.service";
import { SET_ID, SET_NAME, SET_IMG, SET_LIKED_TRACKS, ADD_LIKED_TRACK, REMOVE_LIKED_TRACK } from "../reducers/user.reducer";
import { store } from "../store";

export const LIKED_TRACK_AS_STATION_ID = 'track'

export async function initUser() {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    try {
        const user = await userService.getUser()
        const { _id, fullname, imgUrl, likedTracks } = user
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

export function getLikedTracksAsStation() {
    const likedTracks = store.getState().userModule.likedTracks
    const station = stationService.createStation('Liked Songs', getBasicUser(), utilService.getImgUrl('../assets/imgs/LikedSongs.png'))
    station.tracks = Object.keys(likedTracks).map((key) => likedTracks[key])
    station._id = LIKED_TRACK_AS_STATION_ID
    return station
}

export function getBasicUser() {
    const user = store.getState().userModule
    const { _id, fullname, imgUrl } = user
    return { _id, fullname, imgUrl }
}

export function toggleLikedTrack(track) {
    const user = store.getState().userModule
    if(user.likedTracks[track.url]) removeLikedTrack(user, track)
    else addLikedTrack(user, track)
}

async function addLikedTrack(user, track) {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    try {
        userService.setUser({...user, likedTracks: {...user.likedTracks, [track.url]: track}})
        store.dispatch({ type: ADD_LIKED_TRACK, track })
        eventBusService.showSuccessMsg('Added to Liked Songs.')
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
        eventBusService.showSuccessMsg('Removed from Liked Songs.')
    } catch (err) {
        console.log('Had issues Removing station', err);
        throw err
    } finally {
        // store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    }
}