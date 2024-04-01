import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import defaultImgUrl from '../assets/imgs/MeloDiva.png';
import { IndexContext } from '../cmps/IndexContext.jsx';
import { svgSvc } from '../services/svg.service.jsx';
import { getQueuedStaion, setQueueToStation } from '../store/actions/queue.actions.js';
import { stationService } from '../services/station.service.js';
import { pause, play } from '../store/actions/player.actions.js';

export const StationPreview = ({ station, type = "basic" }) => {
  const { setFilterBy } = useContext(IndexContext);
  const queuedStationId = useSelector(state => state.queueModule.station?._id)
  const isPlaying = useSelector(state => state.playerModule.isPlaying);
  const dispatch = useDispatch();

  function handleOnClick(collectionId) {
    const newFilterBy = {
      tab: 'station',
      collectionId: collectionId,
      text: '',
    };

    setFilterBy(prevFilterBy => ({...stationService.filterByUpdateHistory(prevFilterBy, newFilterBy)}))
  }

  function onPlayClicked(ev) {
    ev.stopPropagation()
    if( getQueuedStaion()?._id === station._id) {
      isPlaying ? dispatch(pause()) : dispatch(play())
    } else {
        setQueueToStation(station)
    }
  }

  const stationImgURL = station?.imgUrl === "default_thumbnail_url" ? defaultImgUrl : station?.imgUrl;

  if (!station) {
    switch(type) {
      case "basic":
        return (
          <div className="station-preview skeleton basic">
            <div className="image-container skeleton">
              <div className="img skeleton"></div>
            </div>
            <div className="station-info skeleton">
              <div className="station-name skeleton"></div>
              <div className="creator-name skeleton"></div>
            </div>
          </div>
        )
      case "home-head":
        return (
          <div className="station-preview skeleton home-head">
            <div className="image-container skeleton">
              <div className="img skeleton"></div>
            </div>
            <div className="station-info skeleton">
              <div className="station-name skeleton"></div>
            </div>
          </div>
        )
      case "mini":
        return (
          <div className="station-preview skeleton mini">
            <div className="image-container skeleton">
              <div className="img skeleton"></div>
            </div>
          </div>
        )
    }
  }

  const isThisStationPlaying = queuedStationId === station?._id && isPlaying
  switch(type) {
    case "basic":
      return (
        <div className="station-preview basic" onClick={() => handleOnClick(station._id)}>
          <div className="image-container">
            <img className="img" src={stationImgURL} alt={station?.artist} />
            {isThisStationPlaying ?
              <button className="pause-btn" onClick={onPlayClicked}>
                <svgSvc.general.PlaylistPauseBtn color={"black"}/>
              </button>
              :
              <button className="play-btn" onClick={onPlayClicked}>
                <svgSvc.general.PlaylistPlayBtn color={"black"}/>
              </button>
            }
          </div>
          <div className="station-info">
            <h3 className={`station-name ${queuedStationId === station._id && "green"}`}>{station?.name}</h3> {/* station?.artist */}
            <p className="creator-name">{station?.createdBy?.fullname}</p>
          </div>
        </div>
      )
    case "home-head":
      return (
        <div className="station-preview home-head" onClick={() => handleOnClick(station._id)}>
          <div className="image-container">
            <img className="img" src={stationImgURL} alt={station?.artist} />
          </div>
          <div className="station-info">
            <h3 className={`station-name ${queuedStationId === station._id && "green"}`}>{station?.name}</h3> {/* station?.artist */}
            {isThisStationPlaying ?
              <button className="pause-btn" onClick={onPlayClicked}>
                <svgSvc.general.PlaylistPauseBtn color={"black"}/>
              </button>
              :
              <button className="play-btn" onClick={onPlayClicked}>
                <svgSvc.general.PlaylistPlayBtn color={"black"}/>
              </button>
            }
          </div>
        </div>
      )
    case "mini":
      return (
        <div className="station-preview mini" onClick={() => handleOnClick(station._id)}>
          <div className="image-container">
            <img className="img" src={stationImgURL} alt={station?.artist} />
          </div>
        </div>
      )
  }
};
