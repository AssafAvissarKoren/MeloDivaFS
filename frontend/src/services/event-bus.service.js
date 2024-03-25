function createEventEmitter() {
    const listenersMap = {}
    // Trick for DEBUG
    // window.mapmap = listenersMap
    return {
        on(evName, listener) {
            listenersMap[evName] = (listenersMap[evName]) ? [...listenersMap[evName], listener] : [listener]
            return () => {
                listenersMap[evName] = listenersMap[evName].filter(func => func !== listener)
            }
        },
        emit(evName, data) {
            if (!listenersMap[evName]) return
            listenersMap[evName].forEach(listener => listener(data))
        }
    }
}

const eventBus = createEventEmitter()

function showUserMsg(msg) {
    eventBus.emit('show-user-msg', msg)
}

function showSuccessMsg(txt) {
    const htmlTxt = txt.replace(/\n/g, '<br>');
    showUserMsg({ txt: htmlTxt, type: 'success' });
}

function showTBAMsg(txt) {
    const htmlTxt = txt.replace(/\n/g, '<br>');
    showUserMsg({ txt: htmlTxt, type: 'tba' });
}

function showErrorMsg(txt) {
    const htmlTxt = txt.replace(/\n/g, '<br>');
    showUserMsg({ txt: htmlTxt, type: 'error' });
}

export const eventBusService = {
    eventBus,
    showSuccessMsg,
    showErrorMsg,
    showTBAMsg,
}
