import { playerService } from "../../services/player.service";
import { PLAY, PAUSE, SHUFFLE, LOOP } from "../reducers/player.reducer";
import { store } from "../store";

export async function setPlayState(playStatus) {
    try {
        const playState = await playerService.setPlayState(playStatus)
        store.dispatch({ type: playState ? PLAY : PAUSE, playState })
    } catch (err) {
        console.log('Had issues setting player state', err);
        throw err
    }
}

export async function play() {
    try {
        const playState = await playerService.play()
        store.dispatch({ type: PLAY, playState })
    } catch (err) {
        console.log('Had issues setting player to play', err);
        throw err
    }
}

export async function pause() {
    try {
        const playState = await playerService.pause()
        store.dispatch({ type: PAUSE, playState })
    } catch (err) {
        console.log('Had issues setting player to pause', err);
        throw err
    }
}

export async function toggleShuffle() {
    try {
        const playState = await playerService.toggleShuffle()
        store.dispatch({ type: SHUFFLE, isShuffle: playState.isShuffle })
    } catch (err) {
        console.log('Had issues setting toggling shuffle', err);
        throw err
    }
}

export async function toggleLooping() {
    try {
        const playState = await playerService.toggleLooping()
        store.dispatch({ type: LOOP, isLooping: playState.isLooping })
    } catch (err) {
        console.log('Had issues setting toggling looping', err);
        throw err
    }
}

export function getPlayState() {
    const playState = store.getState().playerModule
    return playState
}

export function getIsTrackPlaying() {
    const isPlaying = store.getState().playerModule.isPlaying
    return isPlaying
}