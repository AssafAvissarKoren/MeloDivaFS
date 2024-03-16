import { LoremIpsum } from 'lorem-ipsum';

export const utilService = {
    makeId,
    saveToStorage,
    loadFromStorage,
    tracking,
    makeLoremWords,
    isoMatch,
    durationInSeconds,
    formatDuration,
    saveToSessionStorage,
    loadFromSessionStorage,
    getImgUrl,
}

const lorem = new LoremIpsum();

function makeId(length = 5) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function saveToStorage(key, value) {
    localStorage[key] = JSON.stringify(value);
}

function saveToSessionStorage(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
}

function loadFromSessionStorage(key) {
    sessionStorage.getItem(key);
}

function loadFromStorage(key, defaultValue = null) {
    var value = localStorage[key] || defaultValue;
    return JSON.parse(value);
}

function tracking(functionRef, ...functionArgs) {
    const functionName = typeof functionRef === 'function' ? functionRef.name : functionRef;
    console.log(`${JSON.stringify(functionName)}:`, ...functionArgs);
}

function makeLoremWords(worCount = 5) {
    return lorem.generateWords(worCount);
}

function isoMatch(isoDuration){ //here comes the boom
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 0;
    const hours = (parseInt(match[1], 10) || 0);
    const minutes = (parseInt(match[2], 10) || 0) + hours * 60;
    const seconds = (parseInt(match[3], 10) || 0);

    return {hours: hours, minutes: minutes, seconds: seconds};
};

function durationInSeconds(isoDuration) {
    const { hours, minutes, seconds } = isoMatch(isoDuration);
    return minutes * 60 + seconds;
};

function formatDuration(isoDuration) {
    const { hours, minutes, seconds } = isoMatch(isoDuration);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

function getImgUrl(url) {
    return new URL(url, import.meta.url).href
}