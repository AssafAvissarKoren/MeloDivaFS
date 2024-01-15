import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

export const userService = {
    createUser,
    getUser,
}

const USER_STORAGE_KEY = 'userDB'

function createUser() {
    const loggedinUser = user;
    utilService.saveToStorage(USER_STORAGE_KEY, loggedinUser);
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
        songs: ["s104", "s111", "s123"],
        albums: ["pl101", "pl107", "pl119"],
    },
    following: {
        artist: ["a321", "a654", "a987"],
        playlists: ["pl101", "pl107", "pl119"],
        podcasts: ["a321", "a654", "a987"],
        users: ["u106", "u726", "u936"],
    }
}
