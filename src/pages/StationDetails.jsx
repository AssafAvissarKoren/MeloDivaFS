import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { getStationById, saveStation } from "../store/actions/station.actions"
import { eventBusService } from "../services/event-bus.service"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList, faPlayCircle } from '@fortawesome/free-solid-svg-icons'
import { faClockFour, faHeart } from '@fortawesome/free-regular-svg-icons'
import { TrackPreview } from "../cmps/TrackPreview"
import { useSelector } from "react-redux"


export function Station() {
    const { stationId } =  useParams()
    const likedTracks = useSelector(storeState => storeState.stationModule.likedTracks)
    const [station, useStation] = useState()

    useEffect(() => {
        loadStation()
    },[])

    async function loadStation() {
        try {
            const station = await getStationById(stationId)
            useStation(station)
        } catch (err) {
            eventBusService.showErrorMsg('faild to load station')
        }
    }

    async function deleteTrack(trackUrl) {
        try {
            const tracks = station.tracks.filter(track => track.url !== trackUrl)
            await saveStation({...station, tracks: tracks})
            useStation({...station, tracks: tracks})
        } catch (err) {
            eventBusService.showErrorMsg('faild to delete station')
            console.log(err)
        }
    }


    if(!station) return <div>loading...</div>
    var trackNum = 1
    return (
    <section className="station container">
        <div className="station-head">
            <div className="station-head-img-container">
                <img className="station-head-img" src={station.imgUrl}/>
            </div>
            <div className="station-head-info">
                <p>Album</p>
                <h1 className="station-name">{station.name}</h1>
                <p></p> {/* station description */}
                <p>{station.createdBy.fullname} - {station.tracks.length}</p>
            </div>
        </div>
        <div className="station-options">
            <button className="station-play-btn" onClick={() => {}}>
                <FontAwesomeIcon icon={faPlayCircle} />
            </button>
            <button className="station-like-btn" onClick={() => {}}>
                <FontAwesomeIcon icon={faHeart} />
            </button>
            <button className="station-more-btn" onClick={() => {}}>
                <p>...</p>
            </button>
            <button className="station-sort-btn" onClick={() => {}}>
                <p>List</p>
                <FontAwesomeIcon icon={faList} />
            </button>
        </div>
        <div className="station-content">
            <div className="station-list-head station-content-layout">
                <p className="track-numder">#</p>
                <p>Title</p>
                <div className="track-time">
                    <FontAwesomeIcon icon={faClockFour} />
                </div>
            </div>
            <div className="br"/>
            <ul className="station-track-list">
                {station.tracks.map(track => 
                    <li key={track.imgUrl}>
                        <TrackPreview 
                            layout={"station-content-layout"}
                            track={track} 
                            trackNum={trackNum++}
                            isLiked={likedTracks[track.url] ? true : false}
                            deleteTrack={deleteTrack}
                        />
                    </li> 
                )}
            </ul>
        </div>
    </section>
    )
}