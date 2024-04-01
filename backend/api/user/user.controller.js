import { userService } from './user.service.js'
import { loggerService } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

export async function getUser(req, res) {
    try {
        const user = await userService.getById(req.params.userId)
        res.send(user)
    } catch (err) {
        loggerService.error('Failed to get user', err)
        res.status(400).send({ err: 'Failed to get user' })
    }
}

export async function getUsers(req, res) {
    try {
        const filterBy = {
            text: req.query.text || '',
            minScore: +req.query.minScore || 0
        }
        const users = await userService.getAll(filterBy)
        res.send(users)
    } catch (err) {
        loggerService.error('Failed to get users', err)
        res.status(400).send({ err: 'Failed to get users' })
    }
}

export async function deleteUser(req, res) {
    try {
        await userService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        loggerService.error('Failed to delete user', err)
        res.status(400).send({ err: 'Failed to delete user' })
    }
}

export async function addUser(req, res) {
    try {
        const user = req.body
        const savedUser = await userService.add(user)
        res.send(savedUser)
    } catch (err) {
        loggerService.error('Failed to create user', err)
        res.status(400).send({ err: 'Failed to create user' })
    }
}

export async function updateUser(req, res) {
    console.log('updateUser req.body:', req.body)
    try {
        const user = req.body
        // const storedUser = await userService.getFullById(req.params.userId)
        // console.log("updateUser storedUser", storedUser)
        // const fullUser = { ...user, 
        //     isAdmin: false,
        //     password: storedUser.password,
        // }
        // console.log('updateUser fullUser:', fullUser)
        const savedUser = await userService.update(user) //fullUser
        res.send(savedUser)
    } catch (err) {
        loggerService.error('Failed to update user', err)
        res.status(400).send({ err: 'Failed to update user' })
    }
}