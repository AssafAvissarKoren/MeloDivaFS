import { useContext, useEffect, useRef, useState } from "react"
import { useParams } from "react-router"
import { useSelector } from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faList, faPlayCircle, faHeart as heartSolid } from '@fortawesome/free-solid-svg-icons'
import { faClockFour, faHeart as heartLined } from '@fortawesome/free-regular-svg-icons'
import defaultImgUrl from '../assets/imgs/MeloDiva.png'

import { eventBusService } from "../services/event-bus.service"
import { dataService } from  '../services/data.service.js'
import { utilService } from '../services/util.service.js'
import { stationService } from '../services/station.service.js'
import { imageService } from '../services/image.service.js'

import { TrackPreview } from "../cmps/TrackPreview"

import { getStationById, removeStation, saveStation } from "../store/actions/station.actions"
import { setQueueToTrack, getCurrentTrackInQueue, setQueueToStation } from '../store/actions/queue.actions.js'
import { LIKED_TRACK_AS_STATION_ID, getBasicUser, getLikedTracksAsStation } from "../store/actions/user.actions.js"
import { IndexContext } from '../cmps/IndexContext.jsx'
import { MiniMenu } from "../cmps/MiniMenu.jsx"
import { miniMenuOptions } from "../cmps/MiniMenuOptions.jsx"
import { svgSvc } from "../services/svg.service"
import { StationSearch } from "../cmps/StationSearch.jsx"

export function StationDetails() {
    const { stationId } =  useParams()
    const { setFilterBy } = useContext(IndexContext)
    const likedTracks = useSelector(storeState => storeState.userModule.likedTracks)
    const [station, setStation] = useState()
    const [menu, setMenu] = useState(0)
    const [tracksWithDurations, setTracksWithDurations] = useState([])

    useEffect(() => {
        loadStation()
    },[stationId])

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
                }))
                setTracksWithDurations(updatedTracks)
            }
            fetchAndSetDurations()
        }
    }, [station])

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
    
    const handleTrackClick = (trackNum) => {
        console.log('handleTrackClick', trackNum)
        setQueueToStation(station, trackNum-1);
    };

    function getImage() {
        if (station) {
            return station.imgUrl == "default_thumbnail_url" ? defaultImgUrl : station.imgUrl
        }
    }

    async function addTrackToStation(track) {
        try {
            const tracks = station.tracks
            tracks.push(track)
            await saveStation({...station, tracks: tracks})
            setStation({...station, tracks: tracks})
        } catch (err) {
            eventBusService.showErrorMsg('faild to add track')
            console.log(err)
        }
    }

    async function onEditDetails(data) {
        try {
            onCloseMiniMenu()
            await saveStation(({...station, ...data}))
            setStation(prevStation => ({...prevStation, ...data}))
        } catch (err) {
            eventBusService.showErrorMsg('faild to save details')
            console.log(err)
        }
    }

    if(!station) return <div>loading...</div>

    const likedTrackStation = stationId === LIKED_TRACK_AS_STATION_ID ? 'hiden' : ''
    const stationByUser = getBasicUser()._id === station.createdBy._id ? 'hiden' : ''
    const isLiked = station.likedByUsers && station.likedByUsers.filter(likedByUser => likedByUser && likedByUser._id === getBasicUser()._id).length !== 0;
    const gradientColor = station.mostCommonColor

    return (
    <section className="station-container">
        <div className="station-head" style={gradientColor ? { background: `linear-gradient(to bottom, ${gradientColor} 0px, #121212 175%)` } : {}}>
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
                    {miniMenuOptions.editStation(getImage(), station.name, station.description, onEditDetails, onCloseMiniMenu)}
                </MiniMenu>
            }
            <div className="station-head-info">
                <p>Playlist</p>
                {stationByUser && !likedTrackStation ?
                    <h1 className="station-name station-btn" onClick={() => setMenu(1)}>{station.name}</h1>
                :
                    <h1 className="station-name">{station.name}</h1>
                }
                <p className="station-description">{station.description}</p>    
                <p>{station.createdBy.fullname} - {station.tracks.length}</p>
            </div>
        </div>
        <div className="station-content-gradient" style={gradientColor ? { background: `linear-gradient(to bottom, ${gradientColor} 0px, #121212 220px)` } : {}}/>
        <div className="station-content">
            <div className="station-options">
                <button className="station-play-btn" onClick={() => handleTrackClick(1)}>
                    <svgSvc.general.PlaylistPlayBtn color={"black"}/>
                    {/* <FontAwesomeIcon icon={faPlayCircle} /> */}
                </button>
                { !likedTrackStation && !stationByUser && 
                    <button className="station-like-btn" onClick={onToggleUserLiked}>
                        {isLiked ? <svgSvc.track.HeartFilled/> : <svgSvc.track.HeartBlank/>} 
                    </button>
                }
                <div className={`station-more-btn ${likedTrackStation}`}>
                    <button className="btn-more" onClick={() => setMenu(2)}>
                        <p>...</p>
                    </button>
                    {menu === 2 && 
                        <MiniMenu location={'right bottom'} onCloseMiniMenu={onCloseMiniMenu}>
                            {!stationByUser && (isLiked ?
                                miniMenuOptions.removeFromLibrary(onToggleUserLiked) :
                                miniMenuOptions.addToLibrary(onToggleUserLiked))
                            }
                            {miniMenuOptions.addToQueue(onCloseMiniMenu)}
                            {miniMenuOptions.hr()}
                            {stationByUser && miniMenuOptions.editDetails(() => setMenu(1))}
                            {stationByUser && miniMenuOptions.deleteObj(onDeleteStation)}
                            {stationByUser && miniMenuOptions.hr()}
                            {miniMenuOptions.share(onCloseMiniMenu)}
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
                                deleteTrack={(!stationByUser || likedTrackStation) ? null : deleteTrack}
                                duration={utilService.formatDuration(track.duration)}
                                handleTrackClick={() => handleTrackClick(trackNum)}
                            />
                        </li> 
                    ))}
                </ul>
            </div>
            {stationByUser && !likedTrackStation && <div className="station-foot">
                {tracksWithDurations?.length !== 0 && <div className="br"/>}
                <StationSearch addTrackToStation={addTrackToStation}/>
            </div>}
        </div>
    </section>
    )
}
