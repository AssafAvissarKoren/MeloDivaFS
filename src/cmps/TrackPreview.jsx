import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-regular-svg-icons'


export function TrackPreview({ layout = '', track, trackNum }) {

    return (
        <section className={`track-preview ${layout}`}>
            <p>{trackNum}</p>
            <img src={track.imgUrl} className="track-preview-img"/>
            <p>{track.title}</p>
            <div className="track-preview-options">
                <FontAwesomeIcon icon={faHeart} />
                <p>song length</p>
                <FontAwesomeIcon icon={faEllipsis} />
            </div>

        </section>
    )
}