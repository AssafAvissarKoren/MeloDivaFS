import { utilService } from './util.service.js';

export const queueService = {
    saveQueue,
    getQueue,
}

const QUEUE_STORAGE_KEY = 'queueDB'

function saveQueue(queue) {
    // console.log('saveQueue', queue)
    utilService.saveToSessionStorage(QUEUE_STORAGE_KEY, queue);
}

function getQueue() {
    const queue = utilService.loadFromSessionStorage(QUEUE_STORAGE_KEY);
    // console.log('getQueue', queue)
    return queue
}

// import { storageService } from './async-storage.service.js'

// async function getQueue() {
//     const playState = await storageService.query(QUEUE_STORAGE_KEY)
//     console.log('getQueue', queue)
//     return queue
// }

// function saveQueue(queue) {
//     localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
//     return queue
// }
