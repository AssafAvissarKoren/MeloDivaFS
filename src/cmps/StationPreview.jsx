import React, { useContext } from 'react';
import defaultImgUrl from '../assets/imgs/MeloDiva.png';
import { IndexContext } from '../cmps/IndexContext.jsx';
import { svgSvc } from '../services/svg.service.jsx';
import { setQueueToStation } from '../store/actions/queue.actions.js';

export const StationPreview = ({ station }) => {
  const { setFilterBy } = useContext(IndexContext);

  function handleOnClick(stationId) {
    const newFilterBy = {
      tab: 'station',
      stationId: stationId,
      text: '',
    };

    setFilterBy(newFilterBy);
  }

  function onPlayClicked(ev) {
    ev.stopPropagation()
    setQueueToStation(station)
  }

  const shortenText = (text, maxLength) => {
    if (text?.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  };
  
  const stationImgURL = station?.imgUrl === "default_thumbnail_url" ? defaultImgUrl : station?.imgUrl;

  if (!station) {
    return (
      <div className="station-preview skeleton">
        <div className="image-container skeleton">
          <div className="img skeleton"></div>
        </div>
        <div className="station-info skeleton">
          <div className="station-name skeleton"></div>
          <div className="creator-name skeleton"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="station-preview" onClick={() => handleOnClick(station._id)}>
      <div className="image-container">
        <img className="img" src={stationImgURL} alt={station?.artist} />
        <button className="play-btn" onClick={onPlayClicked}>
          <svgSvc.general.PlaylistPlayBtn/>
        </button>
      </div>
      <div className="station-info">
        <h3 className="station-name">{station?.name}</h3> {/* station?.artist */}
        <p className="creator-name">{station?.createdBy?.fullname}</p>
      </div>
    </div>
  );
};
