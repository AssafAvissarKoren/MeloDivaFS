import { stationService } from './station.service.js'
import { loggerService } from '../../services/logger.service.js'

// List
export async function getStations(req, res) {
    try {
        const stations = await stationService.getAll()
        res.send(stations)
    } catch (err) {
        loggerService.error('Failed to get stations', err)
        res.status(400).send({ err: 'Failed to get stations'})
    }
}


// Read
export async function getStation(req, res) {
    const { stationId } = req.params
    try {
        const station = await stationService.getById(stationId)
        res.send(station)
    } catch (err) {
        loggerService.error('Failed to get station', err)
        res.status(400).send({ err: 'Failed to get station'})
    }
}


// Delete
export async function removeStation(req, res) {
    const { stationId } = req.params
    try {
        await stationService.remove(stationId)
        res.send('Deleted OK')
    } catch (err) {
        loggerService.error('Failed to remove station', err)
        res.status(400).send({ err: 'Failed to remove station'})
    }
}


// Create
export async function addStation(req, res) {
    const station = req.body
    try {
        const savedStation = await stationService.add(station)
        res.send(savedStation)
    } catch (err) {
        loggerService.error('Failed to save station', err)
        res.status(400).send({ err: 'Failed to save station'})
    }
}

// Update
export async function updateStation(req, res) {
    const stationToUpdate = req.body
    try {
        const savedStation = await stationService.update(stationToUpdate)
        res.send(savedStation)
    } catch (err) {
        loggerService.error('Failed to update station', err)
        res.status(400).send({ err: 'Failed to update station'})
    }
}

// Get Settings
export async function getSettings(req, res) {
    try {
        const settings = await stationService.getSettings();
        res.json(settings)
    } catch (err) {
        loggerService.error('Failed to get settings', err)
        res.status(400).send({ err: 'Failed to get settings'})
    }
}
