import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { useSelector } from 'react-redux';
import { utilService } from '../services/util.service.js'
import { dataService } from '../services/data.service.js'
import { svgSvc } from '../services/svg.service.jsx';
import { Slider } from '@mui/material';
import { playNextTrack, playPrevTrack } from '../store/actions/queue.actions.js'
import { setPlayState } from '../store/actions/player.actions'

export function FooterPlayer({ video }) {
    const [videoDuration, setVideoDuration] = useState("PT0M0S");
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(50);
    const [newTrack, setNewTrack] = useState(false);
    const [isRepeating, setIsRepeating] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);
    const playerRef = useRef(null);
    const thumbnailUrl = video.snippet.thumbnails.default.url;
    const isPlaying = useSelector(state => state.playerModule.isPlaying);

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
                    setCurrentTime(Math.round(playerRef.current.getCurrentTime()));
                }
            }, 1000); // Update every second
        }

        return () => {
            clearInterval(interval);
        };
    }, [isPlaying]);

    useEffect(() => {
        if (video && video.id.videoId) {
            // const fetchVideoDuration = async () => {
            //     try {
            //         const durations = await dataService.getDurations(video.id.videoId);
            //         if (durations) {
            //             setVideoDuration(durations[0]);
            //         }
            //     } catch (error) {
            //         console.error('Error fetching video duration', error);
            //     }
            // };
            // fetchVideoDuration();
            setVideoDuration(video.snippet.duration);
        }    
    }, [video.id.videoId]);

    useEffect(() => {
        const playNextAsync = async () => {
            console.log('currentTime', currentTime, 'videoDuration', utilService.durationInSeconds(videoDuration) - 1, "isShuffling", isShuffling, "isPlaying", isPlaying);
            if (currentTime === (utilService.durationInSeconds(videoDuration) - 1)) {
                if (video) {
                    await playNextTrack(isShuffling)
                }
                // Alternatively, if you want to use playNextTrack, you can await it too
                // await playNextTrack(isShuffling);
            }
        };
        playNextAsync();
    }, [currentTime, videoDuration, isShuffling]);
        
    useEffect(() => {
        setTimeout( async () => {
            if (playerRef.current && playerRef.current.playVideo) {
                playerRef.current.pauseVideo();
                playerRef.current.playVideo();
                await setPlayState(true);
                // setIsPlaying(true);
            }
        }, 1000);
    }, [newTrack])

    const togglePlay = async () => {
        if (playerRef.current) {
            if (isPlaying) {
                playerRef.current.pauseVideo();
                console.log("vid paused!")
            } else {
                playerRef.current.playVideo();
                console.log("vid playing!")
            }
            await setPlayState(!isPlaying);
            // setIsPlaying(!isPlaying);
        }
    };

    const formatTime = (timeInSeconds) => {
        const seconds = Math.floor(timeInSeconds % 60);
        const minutes = Math.floor(timeInSeconds / 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const onReady = (event) => {
        playerRef.current = event.target;
        setNewTrack(!newTrack)
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
    const shuffleQueue = () => {
        setIsShuffling(!isShuffling);
    };

    const playNext = async () => { 
        console.log("nextVideo")
        if (video) {
            await playNextTrack(isShuffling)
            playerRef.current.pauseVideo();
            playerRef.current.playVideo();
            await setPlayState(true);
        }
    };
    
    const playPrev = async () => { 
        console.log("prevVideo")
        if (video) {
            await playPrevTrack(isShuffling)
            playerRef.current.pauseVideo();
            playerRef.current.playVideo();
            await setPlayState(true);
        }
    };

    const shortenText = (text, maxLength = 50) => {
        if (text?.length > maxLength) {
          return text.slice(0, maxLength) + '...';
        }
        return text;
    };
        
    
    const toggleRepeat = () => {
        setIsRepeating(!isRepeating);
    };

    const jump15Back = () => {
        setCurrentTime(Math.round(Math.max(0, currentTime - 15)));
    };
    
    const jump15Forward = () => {
        const maxTime = utilService.durationInSeconds(videoDuration);
        setCurrentTime(Math.round(Math.min(maxTime, currentTime + 15)));
    };
    
    return (
        <footer className="footer-player">
            <div className="video-info">
                <div className="thumbnail">
                    {thumbnailUrl && <img src={thumbnailUrl} alt={`${video.snippet.title} thumbnail`} />}
                </div>
                <div className="title-and-channel">
                    <div className="video-name">{shortenText(video.snippet.title)}</div>
                    <div className="channel-name">{video.snippet.channelTitle}</div>
                </div>
                <div className="fade-out"/>
            </div>
            <div className="player-controls">
                <div className="player-action-buttons-container">
                    <div className="player-action-buttons">
                        {/* <button onClick={jump15Back} name="Jump15Back" className="jump-15-back">
                            <span className="action-button-wrapper"> <svgSvc.player.Jump15SecBack />  </span>
                        </button> */}
                        <button onClick={shuffleQueue} name="Shuffle" className="shuffle">
                            <span className="action-button-wrapper"> <svgSvc.player.Shuffle color={isShuffling ? "#1ed760" : "white"}/>  </span>
                        </button>
                        <button onClick={playPrev} name="Previous" className="previous">
                            <span className="action-button-wrapper"> <svgSvc.player.TrackPrev />  </span>
                        </button>
                        <button onClick={togglePlay} name={isPlaying ? "Pause" : "Play"} className="play-pause">
                            <span className="action-button-wrapper"> {isPlaying ? <svgSvc.player.PauseBtn /> : <svgSvc.player.PlayBtn />}  </span>
                        </button>
                        <button onClick={playNext} name="Next" className="next">
                            <span className="action-button-wrapper"> <svgSvc.player.TrackNext />  </span>
                        </button>
                        <button onClick={toggleRepeat} name="Repeat" className="repeat">
                            <span className="action-button-wrapper"> <svgSvc.player.Repeat color={isRepeating ? "#1ed760" : "white"}/>  </span>
                        </button>
                        {/* <button onClick={jump15Forward} name="Jump15Back" className="jump-15-back">
                        </button> */}
                    </div>
                    <div className="player-action-buttons" style={{ "height": "3px"}} >
                        {/* <button onClick={jump15Back} name="Jump15Back" className="jump-15-back">
                        </button> */}
                        <button onClick={shuffleQueue} name="Shuffle" className="shuffle">
                            {isShuffling && <span className="action-button-wrapper"> <svgSvc.player.ActivationDot/>  </span>}
                        </button>
                        <button onClick={playPrev} name="Previous" className="previous">
                        </button>
                        <button onClick={togglePlay} name={isPlaying ? "Pause" : "Play"} className="play-pause">
                        </button>
                        <button onClick={playNext} name="Next" className="next">
                        </button>
                        <button onClick={toggleRepeat} name="Repeat" className="repeat">
                            {isRepeating && <span className="action-button-wrapper"> <svgSvc.player.ActivationDot/>  </span>}
                        </button>
                        {/* <button onClick={jump15Forward} name="Jump15Back" className="jump-15-back">
                        </button> */}
                    </div>

                </div>
                <div className="progress-section">
                    <span className="current-time">{formatTime(currentTime)}</span>
                    <Slider
                        className="progress-slider"
                        value={currentTime}
                        max={utilService.durationInSeconds(videoDuration)}
                        onChange={(event, newValue) => {
                            if (playerRef.current && playerRef.current.getCurrentTime) {
                                setCurrentTime(Math.round(newValue));
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
                    <span className="action-button-wrapper"> <svgSvc.player.NowPlayingView />  </span>
                </button>
                <button onClick={shuffleQueue} name="Queue" className="action-button queue">
                    <span className="action-button-wrapper"> <svgSvc.player.Queue />  </span>
                </button>
                <button onClick={shuffleQueue} name="Connect to a device" className="action-button connect-to-device">
                    <span className="action-button-wrapper"> <svgSvc.player.ConnectToADevice />  </span>
                </button>
                <button onClick={shuffleQueue} name="Mute" className="action-button mute">
                    <span className="action-button-wrapper">
                        {volume === 0 && <svgSvc.player.VolumeMute />}
                        {volume > 0 && volume <= 33 && <svgSvc.player.VolumeLow />}
                        {volume > 33  && volume <= 66 && <svgSvc.player.VolumeHalf />}                
                        {volume > 66 && volume <= 100 && <svgSvc.player.VolumeFull />}
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
                    <span className="action-button-wrapper"> <svgSvc.player.OpenMiniplayer />  </span>
                </button>
                <button onClick={shuffleQueue} name="Full Screen" className="action-button full-screen">
                    <span className="action-button-wrapper"> <svgSvc.player.FullScreen />  </span>
                </button>
            </div>
            <div className="youtube-container">
                <YouTube videoId={video.id.videoId} opts={opts} onReady={onReady} />
            </div>
        </footer>
    );
}
