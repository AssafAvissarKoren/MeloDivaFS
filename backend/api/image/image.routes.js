import express from 'express'
import { imageColors } from './image.controller.js'
import { log } from '../../middlewares/log.middleware.js'

const router = express.Router()

router.post('/', imageColors); //log('Analyzing Color'), 

export const imageRoutes = router
