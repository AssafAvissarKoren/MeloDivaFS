import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

export const userService = {
    createUser,
    getUser,
}

const USER_STORAGE_KEY = 'userDB'

function createUser() {
    utilService.saveToStorage(USER_STORAGE_KEY, user);
}

async function getUser() {
    return storageService.query(USER_STORAGE_KEY);
}


const user = {
    _id: "u101",
    email: "user@appsus.com", 
    username: "Muko", 
    password: "mukmuk",
    fullname: "Muki Muka",
    imgUrl: "http://some-img",
    liked: {
        stations: ["st109", ],
    },
    following: {
        stations: ["5cksxjas89xjsa8xjsa8jxs09", "st109"],
    }
}
