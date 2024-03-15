import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as heartLined } from '@fortawesome/free-regular-svg-icons'
import { faPlay, faHeart as heartSolid } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef, useState } from 'react'
import { MiniMenu } from './MiniMenu'
import { toggleLikedTrack } from '../store/actions/user.actions'
import defaultImgUrl from '../assets/imgs/MeloDiva.png'
import { miniMenuOptions } from './MiniMenuOptions'


export function TrackPreview({ layout = '', track = null, trackNum = null, isLiked, deleteTrack = null, duration, handleTrackClick, addToThisStation = null}) {
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
        setSelected(prevIsSelected => !prevIsSelected)
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

    function onPlayClicked(ev) {
        ev.stopPropagation()
        handleTrackClick(track)
    }
    
    const trackImgURL = track.imgUrl == "default_thumbnail_url" ? defaultImgUrl : track.imgUrl;

    const selected = isSelected ? 'selected' : ''
    return (
        <section ref={modalRef} className={`track-preview ${layout} ${selected}`} onClick={onToggleSelected} >
            <div className='track-numder'>
                <p className='track-num'>{trackNum || ''}</p>
                <button className="btn-track-play" onClick={onPlayClicked}>
                    <FontAwesomeIcon icon={faPlay} />
                </button>
            </div>
            <div className="track-preview-title">
                <div className="track-preview-img-container">
                    <img src={trackImgURL} className="track-preview-img"/>
                </div>
                <p>{track.title}</p>
            </div>
            {addToThisStation ?
                <div>
                    <button className="track-preview-add" onClick={() => addToThisStation(track)}>Add</button>
                </div>
            :
                <div className="track-preview-options">
                    <button className={`btn-like-track ${isLiked && 'green'}`} onClick={onToggleLiked}>
                        {isLiked 
                        ? 
                        <FontAwesomeIcon icon={heartSolid} /> 
                        :
                        <FontAwesomeIcon icon={heartLined} />}
                    </button>
                    <p>{duration}</p>
                    <button className="btn-more" onClick={toggleMenu}>
                        <p>...</p>
                    </button>
                    {isMenu && 
                            <MiniMenu location={'left bottom'} onCloseMiniMenu={onCloseMiniMenu}>
                                {miniMenuOptions.addToPlaylist(onCloseMiniMenu)}
                                { deleteTrack &&  miniMenuOptions.removeFromPlaylist(onDeleteTrack) }
                                {isLiked ? 
                                    miniMenuOptions.removeFromLikedSongs(onToggleLiked) :
                                    miniMenuOptions.addToLikedSongs(onToggleLiked)
                                }
                                {miniMenuOptions.addToQueue(onCloseMiniMenu)}
                                {miniMenuOptions.hr()}
                                {miniMenuOptions.share(onCloseMiniMenu)}
                            </MiniMenu> 
                        }
                </div>
            }
        </section>
    )
}