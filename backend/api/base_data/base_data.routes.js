import express from 'express'
import { getStations, getCategories } from './base_data.controller.js'
import { log } from '../../middlewares/log.middleware.js'

const router = express.Router()

router.get('/stations', log('Getting base data Stations'), getStations)
router.get('/categories', log('Getting base data Categories'), getCategories)

export const base_dataRoutes = router
