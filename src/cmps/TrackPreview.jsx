import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef, useState } from 'react'
import { MiniMenu } from './MiniMenu'


export function TrackPreview({ layout = '', track, trackNum, deleteTrack }) {
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
            onToggleSelected()
        }
    }

    function onToggleSelected() {
        setSelected(prevIsSelected => !prevIsSelected)
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
                <img src={track.imgUrl} className="track-preview-img"/>
                <p>{track.title}</p>
            </div>
            <div className="track-preview-options">
                <button className="btn-like-track" onClick={() => {}}>
                    <FontAwesomeIcon icon={faHeart} />
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
                            <button onClick={onCloseMiniMenu}>
                                Save to your liked songs
                            </button>
                            <button onClick={onCloseMiniMenu}>
                                Add to queqe
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