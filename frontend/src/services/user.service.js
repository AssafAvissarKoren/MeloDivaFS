import { httpService } from './http.service.js'

export const userService = {
    getUsers,
    getUser,
    setUser,
    getLoggedinUser,
    signup,
    login,
    logout,
}

async function getUsers() {
    const users = await httpService.get(`user`)
    return users
}

async function getUser(userId ) {
    const user = await httpService.get(`user/${userId}`)
    return user
}

async function setUser(user) {
    await httpService.put(`user/${user._id}`, user)
}

async function getLoggedinUser() {
    const user = await httpService.get(`auth/user`)
    return user
}

async function signup(user) {
    return await httpService.post(`auth/signup`, user)
}

async function login(user) {
    return await httpService.post(`auth/login`, user)
}

async function logout() {
    await httpService.post(`auth/logout`)
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

