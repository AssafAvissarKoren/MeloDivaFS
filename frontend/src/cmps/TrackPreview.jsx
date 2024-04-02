import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { MiniMenu } from './MiniMenu'
import { toggleLikedTrack } from '../store/actions/user.actions'
import { miniMenuOptions } from './MiniMenuOptions'
import { addTrackToQueue } from '../store/actions/queue.actions'
import { svgSvc } from "../services/svg.service"
import { PlayAnimation } from './PlayAnimation'
import defaultImgUrl from '../assets/imgs/MeloDiva.png'

export function TrackPreview({ layout = '', track = null, trackNum = null, isLiked, deleteTrack = null, duration, handleTrackClick, addTrackToStation, station = null}, draggable, onDragStart) {
    const [isSelected, setSelected] = useState(false)
    const [isMenu, setIsMenu] = useState(false)
    const modalRef = useRef(track.url)
    const isPlaying = useSelector(state => state.playerModule.isPlaying);
    const queueTrackNum = useSelector(state => state.queueModule.trackNum);
    const queueStationId = useSelector(state => state.queueModule.station?._id);
    const { collectionId } = useParams()

    useEffect(() => {
        if(isSelected) {
            setTimeout(() => {
                document.addEventListener('click', handleClickOutside)
            }, 0)

            return () => {
                document.removeEventListener('click', handleClickOutside)
            }
        }
    },[isSelected])

    function handleClickOutside(ev) {
        if (modalRef.current && !modalRef.current.contains(ev.target)) {
            onToggleSelected(ev)
        }
    }

    function onToggleSelected(ev) { // problem with the call from handleClickOutside setting the Track, problem with de-selecting the other tracks
        setSelected(prevIsSelected => !prevIsSelected)
    }

    function onToggleLiked(ev) {
        ev.stopPropagation()
        setIsMenu(false)
        toggleLikedTrack(track)
    }

    function onAddToQueue(ev) {
        ev.stopPropagation()
        setIsMenu(false)
        addTrackToQueue(track)
    }

    async function onAddToStation(stationId) {
        setIsMenu(false)
        addTrackToStation(track, stationId)
    }

    function toggleMenu() {
        setIsMenu(prevIsMenu => !prevIsMenu)
    }

    function onCloseMiniMenu() {
        setIsMenu(false)
    }

    function onDeleteTrack() {
        deleteTrack(track.url)
    }

    function onPlayClicked(ev) {
        ev.stopPropagation()
        handleTrackClick(track)
    }
    
    function TrackNumber({}) {
        return (
            <div className='track-number'>
                <span className='track-num' onClick={() => handleTrackClick(track)}>
                    {(isPlaying && selected) ? <PlayAnimation /> : trackNum}
                </span>
                <button className="btn-track-play" onClick={() => handleTrackClick(track)}>
                    <span className="action-button-wrapper"> 
                        {(isPlaying && selected) ? <svgSvc.player.PauseBtn color={"white"} /> : <svgSvc.player.PlayBtn color={"white"} /> }
                    </span>
                </button>
            </div>
        );
    }

    function TrackPreviewTitle({title, artist}) {
        return (
            <div className="track-preview-title">
                <div className="track-preview-img-container">
                    <img src={trackImgURL} className="track-preview-img"/>
                </div>
                <p className="track-title" style={{"color": selected ? "#1ed760" : "white"}}>{title}</p>
                <p className="track-artist" style={{"color": selected ? "#1ed760" : "white"}}>{artist}</p>
            </div>
        );
    }

    function TrackPreviewOptions({}) {
        return (
            <div className="track-preview-options">
                <button className={`btn-like-track ${isLiked && 'green'}`} onClick={onToggleLiked}>
                    <span className="action-button-wrapper"> {isLiked ? <svgSvc.track.HeartFilled/> : <svgSvc.track.HeartBlank/>}  </span>
                </button>
                <p className="track-duration">{duration}</p> 
                {/* className="duration" */}
                <button className="btn-more" onClick={toggleMenu}>
                    <p>...</p>
                </button>
                {isMenu && 
                    <MiniMenu location={'left bottom'} onCloseMiniMenu={onCloseMiniMenu}>
                        {miniMenuOptions.addToPlaylist(onAddToStation)}
                        { deleteTrack &&  miniMenuOptions.removeFromPlaylist(onDeleteTrack) }
                        {isLiked ? 
                            miniMenuOptions.removeFromLikedSongs(onToggleLiked) :
                            miniMenuOptions.addToLikedSongs(onToggleLiked)
                        }
                        {miniMenuOptions.addToQueue(onAddToQueue)}
                        {miniMenuOptions.hr()}
                        {miniMenuOptions.share(onCloseMiniMenu)}
                    </MiniMenu> 
                }
            </div>
        );
    }

    function quotesParser1(inputString) {
        // Split the input string by double quotes to extract the track
        const trackRegex = /"(.*?)"/;
        const trackMatch = inputString.match(trackRegex);
        const title = trackMatch ? trackMatch[1] : '';
    
        // Extract the artist by removing the track from the input string
        const artist = inputString.replace(trackRegex, '').trim();
    
        return { artist, title };
    }

    function quotesParser2(inputString) {
        const firstQuoteIndex = inputString.indexOf('"');
        const secondQuoteIndex = inputString.indexOf('"', firstQuoteIndex + 1);
        artist = inputString.substring(0, firstQuoteIndex).trim();
        title = inputString.substring(firstQuoteIndex + 1, secondQuoteIndex).trim();
        return { artist, title };
    }

    function hyphenParser(inputString) {
        const splitIndex = inputString.indexOf("-");
        artist = inputString.substring(0, splitIndex).trim();
        title = inputString.substring(splitIndex + 1).trim();
        return { artist, title };
    }
    

    const trackImgURL = track.imgUrl === "default_thumbnail_url" ? (station === null ? null : (station.imgUrl === null ? defaultImgUrl : station.imgUrl)) : track.imgUrl;
    const selected = (isSelected || (queueTrackNum === (trackNum - 1) && queueStationId === collectionId)) ? 'selected' : ''

    let titleNoStation = ''
    let artist = ''
    let title = ''
    if (station === null) {
        titleNoStation = track.title;
    } else {
        const regexPattern = new RegExp(`\\b${station.name}\\b|Track \\d+\\.`, 'gi');
        titleNoStation = track.title.replace(regexPattern, '').trim();
        console.log(titleNoStation);

        if (titleNoStation.includes("-")) {
            console.log('hyphenParser');
            ({ artist, title } = hyphenParser(titleNoStation));
        } else if (titleNoStation.includes('"')) {
            console.log('quotesParser1');
            ({ artist, title } = quotesParser1(titleNoStation));
            if (artist === '' || title === '') {
                console.log('quotesParser2');
                ({ artist, title } = quotesParser2(titleNoStation));
            }
        }        
    }

    return (
        <section ref={modalRef} className={`track-preview ${layout} ${selected}`} onClick={onToggleSelected} draggable={draggable} onDragStart={onDragStart}>
            <TrackNumber />
            <TrackPreviewTitle title={title} artist={artist}/>
            {layout === 'station-search-track-layout' ?
                <div>
                    <button className="track-preview-add" onClick={() => addTrackToStation(track)}>Add</button>
                </div>
            :
                <TrackPreviewOptions />
            }
        </section>
    )
}


// return (
//     <section ref={modalRef} className={`track-preview ${layout} ${selected}`} onClick={onToggleSelected} >

//         <div className='track-number'>
//             <span className='track-num' onClick={() => handleTrackClick(track)}>
//                 {(isPlaying && selected) ? <PlayAnimation /> : trackNum}
//             </span>
//             <button className="btn-track-play" onClick={() => handleTrackClick(track)}>
//                 <span className="action-button-wrapper"> 
//                     {(isPlaying && selected) ? <svgSvc.player.PauseBtn color={"white"} /> : <svgSvc.player.PlayBtn color={"white"} /> }
//                 </span>
//             </button>
//         </div>

//         <div className="track-preview-img-container">
//             <img src={trackImgURL} className="track-preview-img"/>
//         </div>
//         <p className="track-title" style={{"color": selected ? "#1ed760" : "white"}}>{title}</p>
//         <p className="track-artist" style={{"color": selected ? "#1ed760" : "white"}}>{artist}</p>

//         {layout === 'station-search-track-layout' ?
//             <div>
//                 <button className="track-preview-add" onClick={() => addTrackToStation(track)}>Add</button>
//             </div>
//         :
//             <div className="track-preview-options">
//                 <button className={`btn-like-track ${isLiked && 'green'}`} onClick={onToggleLiked}>
//                     <span className="action-button-wrapper"> {isLiked ? <svgSvc.track.HeartFilled/> : <svgSvc.track.HeartBlank/>}  </span>
//                 </button>
//                 <p className="track-duration">{duration}</p>
//                 <button className="btn-more" onClick={toggleMenu}>
//                     <p>...</p>
//                 </button>
//                 {isMenu && 
//                     <MiniMenu location={'left bottom'} onCloseMiniMenu={onCloseMiniMenu}>
//                         {miniMenuOptions.addToPlaylist(onAddToStation)}
//                         { deleteTrack &&  miniMenuOptions.removeFromPlaylist(onDeleteTrack) }
//                         {isLiked ? 
//                             miniMenuOptions.removeFromLikedSongs(onToggleLiked) :
//                             miniMenuOptions.addToLikedSongs(onToggleLiked)
//                         }
//                         {miniMenuOptions.addToQueue(onAddToQueue)}
//                         {miniMenuOptions.hr()}
//                         {miniMenuOptions.share(onCloseMiniMenu)}
//                     </MiniMenu> 
//                 }
//             </div>
//         }
//     </section>
// )
