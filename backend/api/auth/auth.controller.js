import { authService } from './auth.service.js'
import { loggerService } from './../../services/logger.service.js'
import { userService } from '../user/user.service.js'

export async function login(req, res) {
    const { fullname, password } = req.body
    try {
        const user = await authService.login(fullname, password)
        const loginToken = authService.getLoginToken(user)
        loggerService.info('User login: ', user)
        res.cookie('loginToken', loginToken, { sameSite: 'None', secure: true })
        res.send(user)
    } catch (err) {
        loggerService.error('Failed to Login ' + err)
        res.status(401).send({ err: 'Failed to Login : ' + err })
    }
}

export async function signup(req, res) {
    try {
        const credentials = req.body
        // Never log passwords
        // loggerService.debug(credentials)
        const account = await authService.signup(credentials)
        loggerService.debug(`auth.route - new account created: ` + JSON.stringify(account))
        const user = await authService.login(credentials.fullname, credentials.password)
        loggerService.info('User signup:', user)
        const loginToken = authService.getLoginToken(user)
        res.cookie('loginToken', loginToken, { sameSite: 'None', secure: true })
        res.send(user)
    } catch (err) {
        loggerService.error('Failed to signup ' + err)
        res.status(400).send({ err: 'Failed to signup : ' + err })
    }
}

export async function logout(req, res) {
    try {
        res.clearCookie('loginToken')
        res.send({ msg: 'Logged out successfully' })
    } catch (err) {
        res.status(400).send({ err: 'Failed to logout' })
    }
}

export async function getLoggedInUser(req, res) {
    try {
        if(!req.cookies.loginToken) {
            req.body = { fullname: "Guest", password: '' }
            login(req, res)
        } else {
            const loggedInUser = authService.validateToken(req.cookies.loginToken)
            const user = await userService.getByUsername(loggedInUser.fullname)
            res.send(user)
        }
    } catch (err) {
        res.status(400).send({ err: 'Failed to get logged in user' })
    }
}