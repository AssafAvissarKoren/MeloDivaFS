import { storageService } from './async-storage.service.js'

export const playerService = {
    getPlayState,
    setPlayState,
    play,
    pause,
    toggleShuffle,
    toggleLooping,
    initPlayState,
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

async function play() {
    const playState = await getPlayState()
    return setPlayState({...playState, isPlaying: true});
}

async function pause() {
    const playState = await getPlayState()
    return setPlayState({...playState, isPlaying: false});
}

async function toggleShuffle() {
    const playState = await getPlayState()
    return setPlayState({...playState, isShuffle: !playState.isShuffle});
}

async function toggleLooping() {
    const playState = await getPlayState()
    return setPlayState({...playState, isLooping: !playState.isLooping});
}

function initPlayState() {
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify({isPlaying: false, isShuffle: false, isLooping: false,}));
}