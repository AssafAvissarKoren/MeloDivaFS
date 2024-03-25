import { httpService } from './http.service.js'

export const userService = {
    getUser,
    setUser,
}

async function getUser(userId = "u100") {
    const user = await httpService.get(`user/${userId}`)
    return user
}

async function setUser(user) {
    await httpService.put(`user/${user._id}`, user)
}

// const defaultUser = {
//     _id: "u100",
//     // email: "user@appsus.com", 
//     // username: "Muko", 
//     // password: "mukmuk",
//     fullname: "Muki Muka",
//     imgUrl: "http://some-img",
//     likedTracks: {}
// }

// import { utilService } from './util.service.js'
// import { storageService } from './async-storage.service.js'

// const USER_STORAGE_KEY = 'userDB'

// createUser()

// function createUser() {
//     const users = utilService.loadFromStorage(USER_STORAGE_KEY)
//     if(!users || !users.length) utilService.saveToStorage(USER_STORAGE_KEY, [defaultUser])
// }

// function setUser(user) {
//     storageService.put(USER_STORAGE_KEY, user)
// }

