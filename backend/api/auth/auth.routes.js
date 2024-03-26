import express from 'express'
import { getLoggedInUser, login, logout, signup } from './auth.controller.js'

const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)
router.post('/logout', logout)
router.get('/user', getLoggedInUser)

export const authRoutes = router