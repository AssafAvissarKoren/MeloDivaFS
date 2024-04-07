import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { useSelector, useDispatch } from 'react-redux';
import { utilService } from '../services/util.service.js'
import { svgSvc } from '../services/svg.service.jsx';
import { playNextTrack, playPrevTrack } from '../store/actions/queue.actions.js'
import { pause, play, toggleLooping, toggleShuffle } from '../store/actions/player.actions'
import { VolumeControl } from './VolumeControl.jsx';
import { ProgressSection } from './ProgressSection.jsx';
import defaultImgUrl from '../assets/imgs/MeloDiva.png';

export function FooterPlayer({ video }) {
    const [videoDuration, setVideoDuration] = useState("PT0M0S");
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(50);
    const [newTrack, setNewTrack] = useState(false);
    const [prevThumbnail, setPrevThumbnail] = useState(defaultImgUrl);
    const playerRef = useRef(null);
    // const thumbnailUrl = video.snippet.thumbnails.default.url;
    // const stationImgURL = station?.imgUrl === "default_thumbnail_url" ? defaultImgUrl : station?.imgUrl; 
    const thumbnailUrl = video ? video.snippet.thumbnails.default.url : prevThumbnail;
    const isPlaying = useSelector(state => state.playerModule.isPlaying);
    const isShuffle = useSelector(state => state.playerModule.isShuffle);
    const isLooping = useSelector(state => state.playerModule.isLooping);
    const dispatch = useDispatch();

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

        // dispatch(play()); dispatch(pause()); this changes the playerModule.isPlaying to which isPlaying is subscribed
        if (playerRef.current) {
            if (isPlaying) {
                if (playerRef.current.playVideo) {
                    playerRef.current.playVideo();
                    console.log("vid playing!")
                }
            } else {
                if (playerRef.current.pauseVideo) {
                    playerRef.current.pauseVideo();
                    console.log("vid paused!")
                }
            }
        }

        if (isPlaying) {
            interval = setInterval(() => {
                if (playerRef.current && playerRef.current.getCurrentTime) {
                    setCurrentTime(Math.round(playerRef.current.getCurrentTime()));
                }
            }, 1000);
        }

        return () => {
            clearInterval(interval);
        };
    }, [isPlaying]);

    useEffect(() => {
        if (video && video.id.videoId) {
            setVideoDuration(video.snippet.duration);
        }    
    }, [video.id.videoId]);

    useEffect(() => {
        const playNextAsync = async () => {
            // console.log("currentTime", currentTime, "videoDuration", utilService.durationInSeconds(videoDuration))
            if (currentTime === (utilService.durationInSeconds(videoDuration) - 1)) {
                if (video) {
                    if(isLooping) {
                        resetAndPlay()
                    } else {
                        await playNextTrack()
                    }
                }
            }
        };
        playNextAsync();
    }, [currentTime, videoDuration]);
        
    useEffect(() => {
        setTimeout( async () => {
            if (playerRef.current && playerRef.current.playVideo) {
                setPrevThumbnail(thumbnailUrl)
                playerRef.current.pauseVideo(); //play sequance for loading a new track, no need for play pause when setting the track via next prev
                playerRef.current.playVideo();
                dispatch(play());
            }
        }, 1000);
    }, [newTrack])

    const togglePlay = () => {
        if (isPlaying) {
            dispatch(pause());
        } else {
            dispatch(play());
        }
    };

    const onReady = (event) => {
        playerRef.current = event.target;
        setNewTrack(!newTrack)
    };

    const playNext = async () => { 
        console.log("nextVideo")
        if (video) {
            if(isLooping) {
                resetAndPlay()
            } else {
                await playNextTrack()
            }
        }
    };
    
    const playPrev = async () => { 
        console.log("prevVideo")
        if (video) {
            if(isLooping) {
                resetAndPlay()
            } else {
                await playPrevTrack()
            }
        }
    };

    const jump15Back = () => {
        setCurrentTime(Math.round(Math.max(0, currentTime - 15)));
    };
    
    const jump15Forward = () => {
        const maxTime = utilService.durationInSeconds(videoDuration);
        setCurrentTime(Math.round(Math.min(maxTime, currentTime + 15)));
    };

    const resetAndPlay = () => {
        setCurrentTime(0);
        if (playerRef.current) {
            playerRef.current.seekTo(0);
            dispatch(play());
        }
    };

    function VideoInfo({}) {
        return (
            <div className="video-info">
                <div className="thumbnail">
                    {video.snippet.title && <img src={thumbnailUrl} alt={`${video.snippet.title} thumbnail`} />}
                </div>
                <div className="title-and-channel">
                    {video.snippet.title && <div className="video-name">{video.snippet.title}</div>}
                    {video.snippet.channelTitle && <div className="channel-name">{video.snippet.channelTitle}</div>}
                </div>
                {/* <div className="fade-out"/> */}
            </div>
        );
    }
    
    function PlayerActionButtons({}) {
        return (
            <div className="player-action-buttons-container">
                <div className="player-action-buttons">
                    {/* <button onClick={jump15Back} name="Jump15Back" className="jump-15-back">
                        <span className="action-button-wrapper"> <svgSvc.player.Jump15SecBack />  </span>
                    </button> */}
                    <button onClick={toggleShuffle} name="Shuffle" className="shuffle">
                        <span className="action-button-wrapper"> <svgSvc.player.Shuffle color={isShuffle ? "#1ed760" : "white"}/>  </span>
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
                    <button onClick={toggleLooping} name="Repeat" className="repeat">
                        <span className="action-button-wrapper"> <svgSvc.player.Repeat color={isLooping ? "#1ed760" : "white"}/>  </span>
                    </button>
                    {/* <button onClick={jump15Forward} name="Jump15Back" className="jump-15-back">
                    </button> */}
                </div>
                <div className="player-action-buttons" style={{ "height": "3px"}} >
                    {/* <button onClick={jump15Back} name="Jump15Back" className="jump-15-back">
                    </button> */}
                    <button onClick={toggleShuffle} name="Shuffle" className="shuffle">
                        {isShuffle && <span className="action-button-wrapper"> <svgSvc.player.ActivationDot/>  </span>}
                    </button>
                    <button onClick={playPrev} name="Previous" className="previous">
                    </button>
                    <button onClick={togglePlay} name={isPlaying ? "Pause" : "Play"} className="play-pause">
                    </button>
                    <button onClick={playNext} name="Next" className="next">
                    </button>
                    <button onClick={toggleLooping} name="Repeat" className="repeat">
                        {isLooping && <span className="action-button-wrapper"> <svgSvc.player.ActivationDot/>  </span>}
                    </button>
                    {/* <button onClick={jump15Forward} name="Jump15Back" className="jump-15-back">
                    </button>  */}
                </div>
            </div>
        )
    }

    return (
        <footer className="footer-player">
            <VideoInfo thumbnailUrl={thumbnailUrl} video={video}/>
            <div className="player-controls">
                <PlayerActionButtons />
                <ProgressSection 
                    currentTime={currentTime}
                    videoDuration={videoDuration}
                    playerRef={playerRef}
                    setCurrentTime={setCurrentTime}
                />
            </div>
            <VolumeControl 
                volume={volume} 
                setVolume={setVolume}
                playerRef={playerRef}
            />
            <div className="youtube-container">
                {video && video.id && video.id.videoId && (
                    <YouTube videoId={video.id.videoId} opts={opts} onReady={onReady} />
                )}
            </div>
        </footer>
    );
}