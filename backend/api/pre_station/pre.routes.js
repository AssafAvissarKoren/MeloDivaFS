import express from 'express'
import { getStations, getCategories } from './pre.controller.js'

const router = express.Router()

router.get('/stations', getStations)
router.get('/categories', getCategories)

export const preRoutes = router
