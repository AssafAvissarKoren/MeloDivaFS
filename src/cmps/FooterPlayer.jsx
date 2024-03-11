import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { utilService } from '../services/util.service.js'
import { dataService } from '../services/data.service.js'
import { playerBtnService } from '../services/buttons.service.jsx';
import { Slider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faPauseCircle, faStepForward, faStepBackward, faRedo, faRandom, 
    faPlay, faBars, faMusic, faSquare, faVolumeUp, faVolumeMute, faVolumeLow } from '@fortawesome/free-solid-svg-icons';


export function FooterPlayer({ video }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [videoDuration, setVideoDuration] = useState("PT0M0S");
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(50);
    const playerRef = useRef(null);
    const thumbnailUrl = video.snippet.thumbnails.default.url;

    const opts = {
        height: '390',
        width: '640',
        playerVars: {
            autoplay: 0,
            controls: 0,
            showinfo: 0,
            rel: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            enablejsapi: 1,
        },
    };  
    
    useEffect(() => {
        let interval;

        if (isPlaying) {
            interval = setInterval(() => {
                if (playerRef.current && playerRef.current.getCurrentTime) {
                    setCurrentTime(playerRef.current.getCurrentTime());
                }
            }, 1000); // Update every second
        }

        return () => {
            clearInterval(interval);
        };
    }, [isPlaying]);

    useEffect(() => {
        if (video && video.id.videoId) {
            const fetchVideoDuration = async () => {
                try {
                    const durations = await dataService.getDurations(video.id.videoId);
                    if (durations) {
                        setVideoDuration(durations[0]);
                    }
                } catch (error) {
                    console.error('Error fetching video duration', error);
                }
            };
            fetchVideoDuration();
        }    
    }, [video.id.videoId]);

    const onReady = (event) => {
        // Store the player reference when ready
        playerRef.current = event.target;
        setTimeout(() => {
            if (playerRef.current && playerRef.current.playVideo) {
                playerRef.current.playVideo();
                setIsPlaying(true);
            }
        }, 2000);
    };

    const togglePlay = () => {
        if (playerRef.current) {
            if (isPlaying) {
                playerRef.current.pauseVideo();
            } else {
                playerRef.current.playVideo();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const formatTime = (timeInSeconds) => {
        const seconds = Math.floor(timeInSeconds % 60);
        const minutes = Math.floor(timeInSeconds / 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const changeVolume = (newVolume) => {
        if (playerRef.current) {
            // Ensure the volume is within the valid range (0-100)
            const validVolume = Math.min(100, Math.max(0, newVolume));
            playerRef.current.setVolume(validVolume);
            setVolume(validVolume);
        }
    };

    // Event handlers for player actions (not implemented in this example)
    const jump15Back = () => { /* ... */ };
    const shuffleQueue = () => { /* ... */ };
    const playNext = () => { /* ... */ };
    const playPrev = () => { /* ... */ };
    const toggleRepeat = () => { /* ... */ };
    const jump15Forward = () => { /* ... */ };
   
    return (
        <footer className="footer-player">
            <div className="video-info">
                <div className="thumbnail">
                    {thumbnailUrl && <img src={thumbnailUrl} alt={`${video.snippet.title} thumbnail`} />}
                </div>
                <div className="title-and-channel">
                    <div className="video-name">{video.snippet.title}</div>
                    <div className="channel-name">{video.snippet.channelTitle}</div>
                </div>
            </div>
            <div className="player-controls">
                <div className="player-action-buttons">
                    <button onClick={jump15Back} name="Jump15Back" className="action-button jump-15-back">
                        <span className="action-button-wrapper"> <playerBtnService.Jump15SecondsBack />  </span>
                    </button>
                    <button onClick={shuffleQueue} name="Shuffle" className="action-button shuffle">
                        {/* <FontAwesomeIcon icon={faRandom} /> */}
                        <span className="action-button-wrapper"> <playerBtnService.Shuffle />  </span>
                    </button>
                    <button onClick={playPrev} name="Previous" className="action-button previous">
                        {/* <FontAwesomeIcon icon={faStepBackward} /> */}
                        <span className="action-button-wrapper"> <playerBtnService.TrackPrev />  </span>
                    </button>
                    <button onClick={togglePlay} name={isPlaying ? "Pause" : "Play"} className="action-button play-pause">
                        {/* <FontAwesomeIcon icon={isPlaying ? faPauseCircle : faPlayCircle} /> */}
                        <span className="action-button-wrapper"> {isPlaying ? <playerBtnService.PlayerPlayButton /> : <playerBtnService.PlayerPauseButton />}  </span>

                    </button>
                    <button onClick={playNext} name="Next" className="action-button next">
                        {/* <FontAwesomeIcon icon={faStepForward} /> */}
                        <span className="action-button-wrapper"> <playerBtnService.TrackNext />  </span>
                    </button>
                    <button onClick={shuffleQueue} name="Repeat" className="action-button shuffle">
                        {/* <FontAwesomeIcon icon={faRandom} /> */}
                        <span className="action-button-wrapper"> <playerBtnService.Repeat />  </span>
                    </button>
                    <button onClick={jump15Back} name="Jump15Back" className="action-button jump-15-back">
                        <span className="action-button-wrapper"> <playerBtnService.Jump15SecondsForward />  </span>
                    </button>

                    {/* <button onClick={toggleRepeat} name="Repeat" className="action-button repeat">
                        <FontAwesomeIcon icon={faRedo} />
                    </button> */}
                </div>
                <div className="progress-section">
                    <span className="current-time">{formatTime(currentTime)}</span>
                    <Slider
                        className="progress-slider"
                        value={currentTime}
                        max={utilService.durationInSeconds(videoDuration)}
                        onChange={(event, newValue) => {
                            setCurrentTime(newValue);
                            if (playerRef.current) {
                                playerRef.current.seekTo(newValue);
                            }
                        }}                    
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => formatTime(value)}
                    />
                    <span className="end-time">{utilService.formatDuration(videoDuration)}</span>
                </div>
            </div>
            <div className="volume-control">
                <button onClick={shuffleQueue} name="Now playing view" className="action-button play-in-view">
                    {/* <FontAwesomeIcon icon={faPlay} /> */}
                    <span className="action-button-wrapper"> <playerBtnService.NowPlayingView />  </span>
                </button>
                <button onClick={shuffleQueue} name="Queue" className="action-button queue">
                    {/* <FontAwesomeIcon icon={faBars} /> */}
                    <span className="action-button-wrapper"> <playerBtnService.Queue />  </span>
                </button>
                <button onClick={shuffleQueue} name="Connect to a device" className="action-button connect-to-device">
                    {/* <FontAwesomeIcon icon={faMusic} /> */}
                    <span className="action-button-wrapper"> <playerBtnService.ConnectToADevice />  </span>
                </button>
                <button onClick={shuffleQueue} name="Mute" className="action-button mute">
                    <span className="action-button-wrapper">
                        {/* {volume === 0 && <FontAwesomeIcon icon={faVolumeMute} />} */}
                        {volume === 0 && <playerBtnService.VolumeMute />}

                        {/* {volume > 0 && volume <= 50 && <FontAwesomeIcon icon={faVolumeLow} />} */}
                        {volume > 0 && volume <= 33 && <playerBtnService.VolumeLow />}

                        {/* {volume > 50 && <FontAwesomeIcon icon={faVolumeUp} />} */}
                        {volume > 33  && volume <= 66 && <playerBtnService.VolumeHalf />}                

                        {volume > 66 && volume <= 100 && <playerBtnService.VolumeFull />}
                    </span>
                </button>
                <Slider
                    className="volume-slider"
                    value={volume}
                    min={0}
                    max={100}
                    onChange={(event, newValue) => changeVolume(newValue)}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}%`}
                />
                <button onClick={shuffleQueue} name="Open Miniplayer" className="action-button open-miniplayer">
                    {/* <FontAwesomeIcon icon={faSquare} /> */}
                    <span className="action-button-wrapper"> <playerBtnService.OpenMiniplayer />  </span>
                </button>
                <button onClick={shuffleQueue} name="Full Screen" className="action-button full-screen">
                    <span className="action-button-wrapper"> <playerBtnService.FullScreen />  </span>
                </button>


            </div>
            <div className="youtube-container">
                <YouTube videoId={video.id.videoId} opts={opts} onReady={onReady} />
            </div>
        </footer>
    );
}
