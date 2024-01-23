import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { stationService } from "../services/station.service"
import { eventBusService } from "../services/event-bus.service"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons'
import { TrackPreview } from "../cmps/TrackPreview"
import { utilService } from '../services/util.service.js'
import { FooterPlayer } from '../cmps/FooterPlayer';
import { trackService } from  '../services/track.service.js'


export function StationDetails() {
    const { stationId } =  useParams()
    const [station, setStation] = useState()
    const [tracksWithDurations, setTracksWithDurations] = useState([]);
    const [selectedTrack, setSelectedTrack] = useState(null);

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
        }
    }, [station]);

    async function loadStation() {
        try {
            const station = await stationService.getById(stationId)
            setStation(station)
        } catch (err) {
            eventBusService.showErrorMsg('faild to load station')
        }
    }

    async function deleteTrack(trackUrl) {
        try {
            console.log(station)
            const tracks = station.tracks.filter(track => track.url !== trackUrl)
            await stationService.saveStation({...station, tracks: tracks})
            setStation({...station, tracks: tracks})
        } catch (err) {
            eventBusService.showErrorMsg('faild to delete station')
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
            return await utilService.getDurations(tracksIds)
        } catch (error) {
            console.error('Error fetching video durations', error);
            return []; // Return an empty array in case of an error
        }
    };
    
    const handleTrackClick = (track) => {
        console.log("handleTrackClick", track)
        setSelectedTrack(track);
    };

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
                {tracksWithDurations.map((track, trackNum) => (
                    <li key={track.imgUrl}>
                        <TrackPreview 
                            layout={"station-content-layout"}
                            track={track} 
                            trackNum={trackNum}
                            deleteTrack={deleteTrack}
                            duration={utilService.formatDuration(track.duration)}
                            handleTrackClick={handleTrackClick}
                        />
                    </li> 
                ))}
            </ul>
        </div>
        {selectedTrack && <FooterPlayer video={trackService.trackToVideo(selectedTrack)} />}
    </section>
    )
}