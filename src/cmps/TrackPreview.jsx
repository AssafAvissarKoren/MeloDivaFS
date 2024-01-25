import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as heartLined } from '@fortawesome/free-regular-svg-icons'
import { faPlay, faHeart as heartSolid } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef, useState } from 'react'
import { MiniMenu } from './MiniMenu'
import { toggleLikedTrack } from '../store/actions/station.actions'
import defaultImgUrl from '../assets/imgs/MeloDiva.png'


export function TrackPreview({ layout = '', track, trackNum, isLiked, deleteTrack, duration, handleTrackClick}) {
    const [isSelected, setSelected] = useState(false)
    const [isMenu, setIsMenu] = useState(false)
    const modalRef = useRef(track.url)

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
        ev.stopPropagation();
        setSelected(prevIsSelected => !prevIsSelected)
        handleTrackClick(track)
    }

    function onToggleLiked(ev) {
        ev.stopPropagation()
        setIsMenu(false)
        toggleLikedTrack(track)
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
    
    const trackImgURL = track.imgUrl == "default_thumbnail_url" ? defaultImgUrl : track.imgUrl;

    const selected = isSelected ? 'selected' : ''
    return (
        <section ref={modalRef} className={`track-preview ${layout} ${selected}`} onClick={onToggleSelected} >
            <div className='track-numder'>
                <p className='track-num'>{trackNum}</p>
                <button className="btn-track-play" onClick={() => {}}>
                    <FontAwesomeIcon icon={faPlay} />
                </button>
            </div>
            <div className="track-preview-title">
                <img src={trackImgURL} className="track-preview-img"/>
                <p>{track.title}</p>
            </div>
            <div className="track-preview-options">
                <button className={`btn-like-track ${isLiked && 'green'}`} onClick={onToggleLiked}>
                    {isLiked 
                    ? 
                    <FontAwesomeIcon icon={heartSolid} /> 
                    :
                    <FontAwesomeIcon icon={heartLined} />}
                </button>
                <p>4:56</p>
                <button className="btn-more" onClick={toggleMenu}>
                    <p>...</p>
                </button>
                {isMenu && 
                        <MiniMenu onCloseMiniMenu={onCloseMiniMenu}>
                            <button onClick={onCloseMiniMenu}>
                                Add to playlist
                            </button>
                            <button onClick={onDeleteTrack}>
                                Remove from this playlist
                            </button>
                            <button onClick={onToggleLiked}>
                            {isLiked 
                            ? 
                            'Remove from your liked songs'
                            :
                            'Save to your liked songs'}
                                
                            </button>
                            <button onClick={onCloseMiniMenu}>
                                Add to queue
                            </button>
                            <button onClick={onCloseMiniMenu}>
                                Share
                            </button>
                        </MiniMenu> 
                    }
            </div>
        </section>
    )
}