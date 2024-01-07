import { useEffect, useState } from "react";
import { eventBusService } from "../services/event-bus.service";

export function UserMsg() {
    const [msg, setMsg] = useState(null);

    useEffect(() => {
        const unsubscribe = eventBusService.eventBus.on('show-user-msg', (msg) => {
            setMsg(msg);
            setTimeout(() => {
                onCloseMsg();
            }, 3000);
        });

        return unsubscribe;
    }, []);

    function onCloseMsg() {
        setMsg(null);
    }

    if (!msg) return <></>;

    return (
        <div className={"user-msg " + msg.type}>
            <p dangerouslySetInnerHTML={{ __html: msg.txt }}></p>
            <button onClick={onCloseMsg}>X</button>
        </div>
    );
}
