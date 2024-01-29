import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

export const userService = {
    createUser,
    getUser,
    setUser,
}

const USER_STORAGE_KEY = 'userDB'

function createUser() {
    const users = utilService.loadFromStorage(USER_STORAGE_KEY)
    if(!users || !users.length) utilService.saveToStorage(USER_STORAGE_KEY, [user])
}

async function getUser() {
    const userList = await storageService.query(USER_STORAGE_KEY)
    return userList[0]
}

function setUser(user) {
    storageService.put(USER_STORAGE_KEY, user)
}


const user = {
    _id: "u100",
    // email: "user@appsus.com", 
    // username: "Muko", 
    // password: "mukmuk",
    fullname: "Muki Muka",
    imgUrl: "http://some-img",
    likedTracks: {}
}

createUser()
