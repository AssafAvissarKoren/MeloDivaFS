import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router';

export const StationPreview = ({ station }) => {
  if (!station) return null; // Add a check for null or undefined station

  const navigate = useNavigate();

  console.log(station)

  return (
    <div className="station-preview">
      <div className="image-container">
        <img src={station.imgUrl} alt={station.name} />
        <button className="play-btn" onClick={() => {navigate(`/melodiva/station/${station._id}`, { replace: true })}}>
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
