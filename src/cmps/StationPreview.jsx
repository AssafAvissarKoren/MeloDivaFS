import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import defaultImgUrl from '../assets/imgs/MeloDiva.png'
import { IndexContext } from '../cmps/IndexContext.jsx';

export const StationPreview = ({ station }) => {
  const { setFilterBy } = useContext(IndexContext);

  if (!station) return null;

  function handleOnClick(stationId) {
    const newFilterBy = {
      tab: 'station',
      stationId: stationId,
      text: '',
    };

    setFilterBy(newFilterBy);
  }

  const shortenText = (text, maxLength) => {
    if (text?.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  };  
  
  const stationImgURL = station.imgUrl == "default_thumbnail_url" ? defaultImgUrl : station.imgUrl;

  return (
    <div className="station-preview">
      <div className="image-container">
        <img className="img" src={stationImgURL} alt={station.name} />
        <button className="play-btn" onClick={() => handleOnClick(station._id)}>
          <FontAwesomeIcon icon={faPlayCircle} /> {/* Use Font Awesome icon */}
        </button>
      </div>
      <div className="station-info">
        <h3 className="station-name">{station.name}</h3>
        <p className="creator-name">{station.createdBy.fullname}</p>
      </div>
    </div>
  );
};
