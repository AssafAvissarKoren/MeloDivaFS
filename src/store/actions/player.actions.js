import { playerService } from "../../services/player.service";
import { PLAY, PAUSE } from "../reducers/player.reducer";
import { store } from "../store";

export function play() {
    try {
        const playState = playerService.play()
        store.dispatch({ type: PLAY, playState })
    } catch (err) {
        console.log('Had issues setting player to play', err);
        throw err
    }
}

export function pause() {
    try {
        const playState = playerService.pause()
        store.dispatch({ type: PAUSE, playState })
    } catch (err) {
        console.log('Had issues setting player to pause', err);
        throw err
    }
}

export async function getPlayState() {
    try {
        const playState = await playerService.getPlayState()
        return playState
    } catch (err) {
        console.log('Had issues getting player state', err);
        throw err
    }
}

export async function setPlayState(playStatus) {
    try {
        const playState = playerService.setPlayState(playStatus)
        store.dispatch({ type: playState ? PLAY : PAUSE, playState })
    } catch (err) {
        console.log('Had issues setting player state', err);
        throw err
    }
}