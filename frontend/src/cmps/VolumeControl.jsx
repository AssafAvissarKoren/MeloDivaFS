import React, { useState } from 'react';
import { Slider } from '@mui/material';
import { svgSvc } from '../services/svg.service.jsx';

export function VolumeControl({ volume, setVolume, playerRef }) {
    const [muteVolume, setMuteVolume] = useState(0);

    const toggleMute = () => {
        if (volume == 0) {
            changeVolume(muteVolume)
            setMuteVolume(0)
        } else {
            setMuteVolume(volume)
            changeVolume(0)
        }
    }

    const changeVolume = (newVolume) => {
        if (playerRef.current) {
            const validVolume = Math.min(100, Math.max(0, newVolume));
            playerRef.current.setVolume(validVolume);
            setVolume(validVolume);
        }
    };

    return (
        <div className="volume-control">
            {/* <button onClick={() => {}} name="Now playing view" className="action-button play-in-view">
                <span className="action-button-wrapper"> <svgSvc.player.NowPlayingView />  </span>
            </button>
            <button onClick={() => {}} name="Queue" className="action-button queue">
                <span className="action-button-wrapper"> <svgSvc.player.Queue />  </span>
            </button>
            <button onClick={() => {}} name="Connect to a device" className="action-button connect-to-device">
                <span className="action-button-wrapper"> <svgSvc.player.ConnectToADevice />  </span>
            </button> */}
            <button onClick={() => {toggleMute()}} name="Mute" className="action-button mute">
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
            {/* <button onClick={() => {}} name="Open Miniplayer" className="action-button open-miniplayer">
                <span className="action-button-wrapper"> <svgSvc.player.OpenMiniplayer />  </span>
            </button>
            <button onClick={() => {}} name="Full Screen" className="action-button full-screen">
                <span className="action-button-wrapper"> <svgSvc.player.FullScreen />  </span>
            </button> */}
        </div>
    );
}
