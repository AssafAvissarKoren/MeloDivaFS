import { loggerService } from './logger.service.js'
import { Server } from 'socket.io'

var gIo = null


export function setupSocketAPI(server) {
    gIo = new Server(server, {
        cors: {
            origin: '*',
        }
    })
    gIo.on('connection', (socket) => {
        loggerService.info(`New connected socket [id: ${socket.id}]`)
        socket.on('disconnect', socket => {
            loggerService.info(`Socket disconnected [socketId: ${socket.id}]`)
        })

        socket.on('edit-public-station', station => {
            loggerService.info(`Edited station id: ${station._id}, by socket [id: ${socket.id}]`)
            socket.broadcast.emit('edit-public-station', station)
        })

        socket.on('remove-public-station', stationId => {
            loggerService.info(`Remove station id: ${stationId}, by socket [id: ${socket.id}]`)
            socket.broadcast.emit('remove-public-station', stationId)
        })
    })

}

export const socketService = {
    // set up the sockets service and define the API
    setupSocketAPI,
}