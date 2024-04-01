import io from 'socket.io-client'
import { userService } from './user.service'

export const SOCKET_EMIT_EDIT_PUBLIC_STATION = 'edit-public-station'
export const SOCKET_EMIT_REMOVE_PUBLIC_STATION = 'remove-public-station'

export const SOCKET_EVENT_EDIT_PUBLIC_STATION= 'edit-public-station'
export const SOCKET_EVENT_REMOVE_PUBLIC_STATION = 'remove-public-station'

const baseUrl = (process.env.NODE_ENV === 'production') ? '' : '//localhost:3030'

export const socketService = createSocketService()

// for debugging from console
// window.socketService = socketService
socketService.setup()

function createSocketService() {
    var socket = null
    const socketService = {
        setup() {
            if(socket) return
            socket = io(baseUrl)
        },
        on(eventName, cb) {
            socket.on(eventName, cb)
        },
        off(eventName, cb = null) {
            if (!socket) return;
            if (!cb) socket.removeAllListeners(eventName)
            else socket.off(eventName, cb)
        },
        emit(eventName, data) {
            console.log(socket)
            socket.emit(eventName, data)
        },
        terminate() {
            socket = null
        },

    }
    return socketService
}