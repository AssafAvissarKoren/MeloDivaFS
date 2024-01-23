import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { useState } from 'react'
import { MiniMenu } from './MiniMenu'


export function TrackPreview({ layout = '', track, trackNum, deleteTrack, duration, handleTrackClick }) {
    const [isMenu, setIsMenu] = useState(false)

    function toggleMenu() {
        setIsMenu(currentIsMenu => !currentIsMenu)
    }

    function onCloseMiniMenu() {
        setIsMenu(false)
    }

    function onDeleteTrack() {
        deleteTrack(track.url)
    }

    return (
        <section className={`track-preview ${layout}`} onClick={() => handleTrackClick(track)}>
            <p>{trackNum}</p>
            <img src={track.imgUrl} className="track-preview-img"/>
            <p>{track.title}</p>
            <div className="track-preview-options">
                <FontAwesomeIcon icon={faHeart} />
                <p>{duration}</p>
                <button className="btn-more" onClick={toggleMenu}>
                    <FontAwesomeIcon icon={faEllipsis} />
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