import express from 'express'
import { getSettings, addStation, getStations, getStation, removeStation, updateStation } from './station.controller.js'
import { log } from '../../middlewares/log.middleware.js'
import { requireUser } from '../../middlewares/requireAuth.middleware.js'
import { stationService } from './station.service.js'

const router = express.Router()

const getCreatorStationId = async (req, res) => {
    const { stationId } = req.params;
    try {
        const station = await stationService.getById(stationId);
        console.log('station:', station);
        return station.creator._id;
    } catch (error) {
        console.error('Error fetching station:', error);
        res.status(500).send('Internal Server Error');
    }
};

router.get('/settings', getSettings) // log,
router.get('/', getStations) // log,
router.get('/:stationId', getStation) // log,
router.delete('/:stationId', removeStation); // log, async (req, res, next) => {requireUser(req, res, next, await getCreatorStationId(req, res))}, 
router.post('/', addStation); // log, requireUser,
router.put('/:stationId', updateStation); // log, async (req, res, next) => {requireUser(req, res, next, await getCreatorStationId(req, res))}, 

export const stationRoutes = router
