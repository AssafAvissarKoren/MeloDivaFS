import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'

import { userService } from '../user/user.service.js'
import { loggerService } from '../../services/logger.service.js'

const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')

export const authService = {
    getLoginToken,
    validateToken,
    login,
    signup
}


function getLoginToken(user) {
    const str = JSON.stringify(user)
    const encryptedStr = cryptr.encrypt(str)
    return encryptedStr
}

function validateToken(token) {
    try {
        const json = cryptr.decrypt(token)
        const loggedinUser = JSON.parse(json)
        return loggedinUser

    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}

async function login(fullname, password) {
    const user = await userService.getByUsername(fullname)
    if (!user) throw 'Unkown username'

    //  un-comment for real login
    // const match = await bcrypt.compare(password, user.password)
    // if (!match) throw 'Invalid username or password'

    // Removing passwords and personal data
    const miniUser = {
        _id: user._id,
        fullname: user.fullname,
        imgUrl: user.imgUrl,
        likedTracks: user.likedTracks,
        isAdmin: user.isAdmin,
        // Additional fields required for miniuser
    }
    return miniUser

}

async function signup(user) {
    
    loggerService.debug(`auth.service - signup with fullname: ${user.fullname}`)
    if (!user.password || !user.fullname) throw 'Missing required signup information'
    
    const userExist = await userService.getByUsername(user.fullname)
    if (userExist) throw 'Username already taken'
    
    const saltRounds = 10
    const hash = await bcrypt.hash(user.password, saltRounds)
    return userService.add({...user, password: hash})
}