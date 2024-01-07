import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

export const userService = {
    createUser,
    getUser,
}

const USER_STORAGE_KEY = 'userDB'

function createUser() {
    const loggedinUser = { email: 'user@appsus.com', fullname: 'Mahatma Appsus' }
    utilService.saveToStorage(USER_STORAGE_KEY, loggedinUser)
}

async function getUser() {
    return storageService.query(USER_STORAGE_KEY);
}
