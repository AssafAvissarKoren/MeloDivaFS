import express from 'express'
import { getSettings, addStation, getStations, getStation, removeStation, updateStation } from './station.controller.js'
import { log } from '../../middlewares/log.middleware.js'
import { requireUser } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()

router.post('/', log('Creating Stations'), addStation); //requireUser,
router.get('/', log('Getting Stations'), getStations)
router.get('/settings', log('Getting Station Settings'), getSettings)
router.get('/:stationId', log('Getting Station'), getStation)
router.put('/:stationId', log('Updating Stations'), updateStation); //async (req, res, next) => {requireUser(req, res, next, await getCreatorStationId(req, res))}, 
router.delete('/:stationId', log('Deleting Stations'), removeStation); //async (req, res, next) => {requireUser(req, res, next, await getCreatorStationId(req, res))}, 

export const stationRoutes = router
