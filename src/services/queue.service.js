import { dataService } from './data.service.js';
import { utilService } from './util.service.js';
import { storageService } from './async-storage.service.js'

export const queueService = {
    saveQueue,
    getQueue,
}

const QUEUE_STORAGE_KEY = 'queueDB'

async function saveQueue(queue) {
    utilService.saveToSessionStorage(QUEUE_STORAGE_KEY, queue);
}

async function getQueue() {
    utilService.loadFromSessionStorage(QUEUE_STORAGE_KEY);
}
