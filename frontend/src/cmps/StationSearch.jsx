import React, { useState, useRef } from 'react';
import { dataService } from '../services/data.service.js';
import { trackService } from '../services/track.service.js';
import { useSelector } from 'react-redux';
import { utilService } from '../services/util.service.js';
import { TrackPreview } from '../cmps/TrackPreview.jsx';
import { getCurrentTrackInQueue, setQueueToStation } from '../store/actions/queue.actions.js';
import { getIsTrackPlaying } from '../store/actions/player.actions.js';
import { pause, play } from "../store/actions/player.actions.js"
import { svgSvc } from '../services/svg.service.jsx';

export function StationSearch({addTrackToStation, addBr}) {
    const [isActive, setIsActive] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [tracks, setTracks] = useState([])
    const typingTimeoutRef = useRef(null);
    const likedTracks = useSelector(storeState => storeState.userModule.likedTracks)


    const searchVideos = async (query) => {
        try {
            const items = await dataService.searchYoutube(query);
            const validItems = items.filter(video => video.id.videoId); // Filter out items with undefined video.url
            const videos = validItems.map(video => ({...trackService.videoToTrack(video)}))
            console.log('videos', videos)
            
            const videoIds = videos.map(video => {
                if (video.url.includes('=')) {
                    const urlParts = video.url.split('=');
                    return urlParts[urlParts.length - 1];
                } else {
                    return video.url;
                }
            }).join(',');
            
            const trackDurations =  await dataService.getDurations(videoIds)
            const tracks = validItems.map((video, index)=> {
                return {
                    ...trackService.videoToTrack(video), 
                    duration: trackDurations[index]
                }
            })
            console.log('tracks', tracks)
            setTracks(tracks)
        } catch (error) {
            console.error('Error fetching data from YouTube API', error);
        }
    }

    const handleTrackClick = (track) => {
        if(getCurrentTrackInQueue().url === track.url) {
            getIsTrackPlaying() ? dispatch(pause()) : dispatch(play())
        } else {
            setQueueToStation(station, trackNum-1);
        }
    }

    const handleTextChange = (e) => {
        const newText = e.target.value;
        setSearchText(newText);
        clearTimeout(typingTimeoutRef.current); // Clear the previous typing timeout
        typingTimeoutRef.current = setTimeout(() => {
            searchVideos(searchText)
        }, 1000); // Set a new typing timeout
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            clearTimeout(typingTimeoutRef.current); // Clear the typing timeout if "Enter" is pressed
            searchVideos(searchText)
        }
    }

    function clearSearch() {
        setSearchText('')
        setTracks([])
    }
    
    if(!isActive) return (
        <div className="station-search">
            <div className="find-more" onClick={() => setIsActive(true)}>
                Find more
            </div>
        </div>
    )
    return (
        <div className="station-search">
            {addBr && <div className="br"/>}
            <div className='search-head'>
                <h2 className="search-title">Let's find something for your playlist</h2>
                <label className="search-bar-container">
                    <div className="img-container">
                        <svgSvc.icon.SearchIcon />
                        {/* <img className="search-img" src={utilService.getImgUrl("../assets/imgs/search.svg")} /> */}
                    </div>
                    <input 
                        className="search-bar"
                        type="text" 
                        placeholder="What do you want to play?" 
                        value={searchText} 
                        onChange={handleTextChange}
                        onKeyDown={handleKeyDown}
                    />  
                    {searchText &&
                        <div className="img-container" onClick={clearSearch}>
                            <svgSvc.miniMenu.Ex />
                            {/* <img className="ex-img" src={utilService.getImgUrl("../assets/imgs/ex.svg")} /> */}
                        </div>
                    }
                </label>
                <div className="btn-container" onClick={() => {setIsActive(prev => !prev); clearSearch()}}>
                    <svgSvc.miniMenu.Ex color={'grey'}/>
                    {/* <img className="ex-img" src={utilService.getImgUrl("../assets/imgs/ex.svg")} /> */}
                </div>
            </div>
            <div className="search-res">
                {tracks.map((track, index) => (
                    <div key={track.url || index}>
                        <TrackPreview 
                            layout={'station-search-track-layout'}
                            track={track} 
                            isLiked={likedTracks[track.url] ? true : false}
                            duration={utilService.formatDuration(track.duration)}
                            handleTrackClick={handleTrackClick}
                            addTrackToStation={addTrackToStation}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
