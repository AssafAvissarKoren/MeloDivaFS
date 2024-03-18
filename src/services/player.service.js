import { storageService } from './async-storage.service.js'

export const playerService = {
    getPlayState,
    setPlayState,
    play,
    pause,
}

const PLAYER_STORAGE_KEY = 'playerDB'


async function getPlayState() {
    const playState = await storageService.query(PLAYER_STORAGE_KEY)
    return playState
}

function setPlayState(playState) {
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(playState));
    return playState
}

function play() {
    return setPlayState(true);
}

function pause() {
    return setPlayState(false);
}
