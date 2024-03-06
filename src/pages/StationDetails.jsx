import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import { useSelector } from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList, faPlayCircle, faHeart as heartSolid } from '@fortawesome/free-solid-svg-icons'
import { faClockFour, faHeart as heartLined } from '@fortawesome/free-regular-svg-icons'
import defaultImgUrl from '../assets/imgs/MeloDiva.png'

import { eventBusService } from "../services/event-bus.service"
import { dataService } from  '../services/data.service.js'
import { utilService } from '../services/util.service.js'
import { stationService } from '../services/station.service.js'
import { imageService } from '../services/image.service.js'

import { TrackPreview } from "../cmps/TrackPreview"

import { getStationById, removeStation, saveStation } from "../store/actions/station.actions"
import { setQueueToTrack, getCurrentTrackInQueue } from '../store/actions/queue.actions.js'
import { LIKED_TRACK_AS_STATION_ID, getBasicUser, getLikedTracksAsStation } from "../store/actions/user.actions.js"
import { IndexContext } from '../cmps/IndexContext.jsx'
import { MiniMenu } from "../cmps/MiniMenu.jsx"

export function StationDetails() {
    const { stationId } =  useParams()
    const { setFilterBy } = useContext(IndexContext)
    const likedTracks = useSelector(storeState => storeState.userModule.likedTracks)
    const [station, setStation] = useState()
    const [menu, setMenu] = useState(0)
    const [tracksWithDurations, setTracksWithDurations] = useState([])
    const [gradientColor, setGradientColor] = useState(null);

    useEffect(() => {
        loadStation()
    },[stationId])

    async function analyzeImage(imageURL) {
        try {
            // imageService.saveImage(imageURL)
            // const mostCommonColor = await stationService.colorAnalysis(imageURL)
            const mostCommonColor = "red" 
            setGradientColor(mostCommonColor);
        } catch (error) {
            console.error('Error analyzing image:', error);
        }
    }

    useEffect(() => {
        analyzeImage(getImage());
    },[station])


    useEffect(() => {
        if(stationId === LIKED_TRACK_AS_STATION_ID) {
            const tracks = Object.keys(likedTracks).map((key) => likedTracks[key])
            setStation(prevStation => ({...prevStation, tracks: tracks}))
        }
    },[likedTracks])

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
        if (stationId === LIKED_TRACK_AS_STATION_ID) {
          const station = getLikedTracksAsStation();
          setStation(station);
        } else {
          try {
            const station = await getStationById(stationId);
            setStation(station);
          } catch (err) {
            eventBusService.showErrorMsg('failed to load station');
          }
        }
      }
      

    function onToggleUserLiked() {
        const user = getBasicUser()
        const numOfLikedUsers = station.likedByUsers.length
        var newLikedByUsers = station.likedByUsers.filter(likedByUser => likedByUser._id !== user._id)
        
        // if you didn't remove the user then add them
        if(numOfLikedUsers === newLikedByUsers.length) newLikedByUsers.push(user)
        
        onCloseMiniMenu()
        saveStation({...station, likedByUsers: newLikedByUsers})
        setStation(prevStation => ({...prevStation, likedByUsers: newLikedByUsers}))
    }

    function onCloseMiniMenu() {
        setMenu(0)
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

    function onDeleteStation() {
        removeStation(stationId)

        const newFilterBy = {
            tab: 'home',
            stationId: '',
            text: '',
        };
    
        setFilterBy(newFilterBy);
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

    function getImage() {
        if (station) {
            return station.imgUrl == "default_thumbnail_url" ? defaultImgUrl : station.imgUrl
        }
    }


    if(!station) return <div>loading...</div>

    const likedTrackStation = stationId === LIKED_TRACK_AS_STATION_ID ? 'hiden' : ''
    const stationByUser = getBasicUser()._id === station.createdBy._id ? 'hiden' : ''
    const isLiked = station.likedByUsers && station.likedByUsers.filter(likedByUser => likedByUser && likedByUser._id === getBasicUser()._id).length !== 0;

    return (
    <section className="station-container">
        <div className="station-head" style={gradientColor ? { background: gradientColor } : {}}>
            {stationByUser && !likedTrackStation ?
                <button className="station-head-img-container" onClick={() => setMenu(1)}>
                    <img className="station-head-img" src={getImage()}/>
                </button>
            :
                <div className="station-head-img-container">
                    <img className="station-head-img" src={getImage()}/>
                </div>
            }
            {menu === 1 && 
                <MiniMenu location={'center'} onCloseMiniMenu={onCloseMiniMenu}>
                    <h1>Edit details</h1>
                    <img src={getImage()}/>
                    <p>name</p>
                    <p>description</p>
                </MiniMenu>
            }
            <div className="station-head-info">
                <p>Playlist</p>
                {stationByUser && !likedTrackStation ?
                    <h1 className="station-name station-btn" onClick={() => setMenu(1)}>{station.name}</h1>
                :
                    <h1 className="station-name">{station.name}</h1>
                }
                <p></p> {/* station description */}
                <p>{station.createdBy.fullname} - {station.tracks.length}</p>
            </div>
        </div>
        <div className="station-content" style={gradientColor ? { background: `linear-gradient(to bottom, ${gradientColor} 0px, #121212 220px)` } : {}}>
            <div className="station-options">
                <button className="station-play-btn" onClick={() => {}}>
                    <FontAwesomeIcon icon={faPlayCircle} />
                </button>
                <button className={`station-like-btn ${likedTrackStation} ${stationByUser} ${isLiked && 'green'}`} onClick={onToggleUserLiked}>
                    <FontAwesomeIcon icon={isLiked ? heartSolid : heartLined} />
                </button>
                <div className={`station-more-btn ${likedTrackStation}`}>
                    <button className="btn-more" onClick={() => setMenu(2)}>
                        <p>...</p>
                    </button>
                    {menu === 2 && 
                        <MiniMenu location={'right bottom'} onCloseMiniMenu={onCloseMiniMenu}>
                            {stationByUser
                                ?
                                <button onClick={onDeleteStation}>
                                    Delete
                                </button>
                                :
                                <button onClick={onToggleUserLiked}>
                                    {isLiked 
                                        ? 
                                        'Remove from your library'
                                        :
                                        'Add to your library'
                                    }
                                </button>
                            }
                            <button onClick={onCloseMiniMenu}>
                                Add to queue
                            </button>
                            <button onClick={onCloseMiniMenu}>
                                Share
                            </button>
                        </MiniMenu> 
                    }
                </div>
                <button className="station-sort-btn" onClick={() => {}}>
                    <p>List</p>
                    <FontAwesomeIcon icon={faList} />
                </button>
            </div>
            <div className="station-list">
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
        </div>
    </section>
    )
}
