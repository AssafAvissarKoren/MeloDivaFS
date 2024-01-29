import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { useSelector } from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList, faPlayCircle } from '@fortawesome/free-solid-svg-icons'
import { faClockFour, faHeart } from '@fortawesome/free-regular-svg-icons'
import defaultImgUrl from '../assets/imgs/MeloDiva.png'

import { eventBusService } from "../services/event-bus.service"
import { trackService } from  '../services/track.service.js'
import { dataService } from  '../services/data.service.js'
import { utilService } from '../services/util.service.js'

import { TrackPreview } from "../cmps/TrackPreview"

import { getStationById, saveStation } from "../store/actions/station.actions"
import { setQueueToTrack, getCurrentTrackInQueue } from '../store/actions/queue.actions.js';

export function StationDetails() {
    const { stationId } =  useParams()
    const likedTracks = useSelector(storeState => storeState.stationModule.likedTracks)
    const [station, setStation] = useState()
    const [tracksWithDurations, setTracksWithDurations] = useState([]);
    let stationImgURL

    useEffect(() => {
        loadStation()
    },[])

    useEffect(() => {
        if (station && station.tracks) {
            const fetchAndSetDurations = async () => {
                const durations = await fetchVideoDurations(station);
                const updatedTracks = station.tracks.map((track, index) => ({
                    ...track,
                    duration: durations[index] || 'N/A'
                }));
                setTracksWithDurations(updatedTracks);
            };
    
            fetchAndSetDurations();
            stationImgURL = station.imgUrl == "default_thumbnail_url" ? defaultImgUrl : station.imgUrl;
        }
    }, [station]);

    async function loadStation() {
        try {
            const station = await getStationById(stationId)
            setStation(station)
        } catch (err) {
            eventBusService.showErrorMsg('faild to load station')
        }
    }

    async function deleteTrack(trackUrl) {
        try {
            const tracks = station.tracks.filter(track => track.url !== trackUrl)
            await saveStation({...station, tracks: tracks})
            setStation({...station, tracks: tracks})
        } catch (err) {
            eventBusService.showErrorMsg('faild to delete track')
            console.log(err)
        }
    }

    const fetchVideoDurations = async (station) => {
        try {
            // Extract the video IDs from the track URLs
            const tracksIds = station.tracks.map(track => {
                // Assuming the URL contains the video ID at the end after '='
                const urlParts = track.url.split('=');
                return urlParts[urlParts.length - 1];
            }).join(',');
            return await dataService.getDurations(tracksIds)
        } catch (error) {
            console.error('Error fetching video durations', error);
            return []; // Return an empty array in case of an error
        }
    };
    
    const handleTrackClick = (track) => {
        setQueueToTrack(track);
    };

    if(!station) return <div>loading...</div>

    return (
    <section className="station container">
        <div className="station-head">
            <div className="station-head-img-container">
                <img className="station-head-img" src={stationImgURL}/>
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
                {tracksWithDurations.map((track, trackNum) => (
                    <li key={track.imgUrl}>
                        <TrackPreview 
                            layout={"station-content-layout"}
                            track={track} 
                            trackNum={++trackNum}
                            isLiked={likedTracks[track.url] ? true : false}
                            deleteTrack={deleteTrack}
                            duration={utilService.formatDuration(track.duration)}
                            handleTrackClick={handleTrackClick}
                        />
                    </li> 
                ))}
            </ul>
        </div>
    </section>
    )
}