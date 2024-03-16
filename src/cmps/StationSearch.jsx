import React, { useState, useEffect } from 'react';
import { CategoryDisplay } from '../cmps/CategoryDisplay.jsx';
import { categoryService } from '../services/category.service';
import { dataService } from '../services/data.service.js';
import { setQueueToTrack } from '../store/actions/queue.actions.js';
import { trackService } from '../services/track.service.js';
import { useSelector } from 'react-redux';
import { utilService } from '../services/util.service.js';
import { TrackPreview } from '../cmps/TrackPreview.jsx';


export function StationSearch({addTrackToStation}) {
    const [searchText, setSearchText] = useState('')
    const [tracks, setTracks] = useState([])
    const likedTracks = useSelector(storeState => storeState.userModule.likedTracks)


    const searchVideos = async (query) => {
        try {
            const response = await dataService.searchYoutube(query)
            const videos = response.data.items.map(video => ({...trackService.videoToTrack(video)}))
            
            const videoIds = videos.map(video => {
                // Assuming the URL contains the video ID at the end after '='
                const urlParts = video.url.split('=')
                return urlParts[urlParts.length - 1]
            }).join(',')

            const trackDurations =  await dataService.getDurations(videoIds)
            const tracks = response.data.items.map((video, index)=> {
                return {
                    ...trackService.videoToTrack(video), 
                    duration: trackDurations[index]
                }
            })
            setTracks(tracks)
        } catch (error) {
            console.error('Error fetching data from YouTube API', error)
        }
    }

    const handleTrackClick = (track) => { //here comes the boom
        setQueueToTrack(track)
    }

    const handleTextChange = (e) => {
        setSearchText(e.target.value)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            searchVideos(searchText)
        }
    }
    
    return (
        <div className="station-search">
            <h2 className="search-title">Let's find something for your playlist</h2>
            <label className="search-bar-container">
                <div className="img-contaner">
                    <img className="search-img" src={utilService.getImgUrl("../assets/imgs/search.svg")} />
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
                    <div className="img-contaner" onClick={() => setSearchText('')}>
                        <img className="ex-img" src={utilService.getImgUrl("../assets/imgs/ex.svg")} />
                    </div>
                }
            </label>
            <div className="search-res">
                {tracks.map((track, index) => (
                    <div key={track.url || index}>
                        <TrackPreview 
                            layout={'station-search-track-layout'}
                            track={track} 
                            isLiked={likedTracks[track.url] ? true : false}
                            duration={utilService.formatDuration(track.duration)}
                            handleTrackClick={handleTrackClick}
                            addToThisStation={addTrackToStation}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
