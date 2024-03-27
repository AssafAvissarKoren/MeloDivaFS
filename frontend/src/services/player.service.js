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
    // console.log('playerService getPlayState')
    const playState = await storageService.query(PLAYER_STORAGE_KEY)
    return playState
}

function setPlayState(playState) {
    // console.log('playerService setPlayState')
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(playState));
    return playState
}

async function play() {
    // console.log('playerService play')
    const playState = await getPlayState()
    return setPlayState({...playState, isPlaying: true});
}

async function pause() {
    // console.log('playerService pause')
    const playState = await getPlayState()
    return setPlayState({...playState, isPlaying: false});
}

async function toggleShuffle() {
    // console.log('playerService toggleShuffle')
    const playState = await getPlayState()
    return setPlayState({...playState, isShuffle: !playState.isShuffle});
}

async function toggleLooping() {
    // console.log('playerService toggleLooping')
    const playState = await getPlayState()
    return setPlayState({...playState, isLooping: !playState.isLooping});
}

function initPlayState() {
    // console.log('playerService initPlayState')
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify({isPlaying: false, isShuffle: false, isLooping: false,}));
}