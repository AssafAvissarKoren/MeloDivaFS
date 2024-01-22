import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { stationService } from "../services/station.service"
import { eventBusService } from "../services/event-bus.service"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons'
import { TrackPreview } from "../cmps/TrackPreview"


export function Station() {
    const { stationId } =  useParams()
    const [station, useStation] = useState()

    useEffect(() => {
        loadStation()
    },[])

    async function loadStation() {
        try {
            const station = await stationService.getById(stationId)
            useStation(station)
        } catch (err) {
            eventBusService.showErrorMsg('faild to load station')
            console.log(err)
        }
    }


    if(!station) return <div>loading...</div>
    var trackNum = 1
    return (
    <section className="station container">
        <div className="station-head">
            <img className="station-head-img" src={station.imgUrl}/>
            <div className="station-head-info">
                <h1>{station.name}</h1>
                <p>{station.createdBy.fullname} - {station.tracks.length}</p>
            </div>
        </div>
        <div className="station-options">
            <button className="station-play-btn" onClick={() => {}}>
            <FontAwesomeIcon icon={faPlayCircle} />
            </button>
        </div>
        <div className="station-content station-content-layout">

            <ul className="station-track-list">
                {station.tracks.map(track => 
                    <li key={track.imgUrl}>
                        <TrackPreview 
                            layout={"station-content-layout"}
                            track={track} 
                            trackNum={trackNum++}
                        />
                    </li> 
                )}
            </ul>
        </div>
    </section>
    )
}