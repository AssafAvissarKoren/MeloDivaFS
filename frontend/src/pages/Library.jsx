import React, { useEffect, useRef } from 'react';
import { useSelector } from "react-redux"
import { StationPreview } from "../cmps/StationPreview"
import { getCurrentUser, getLikedTracksAsStation } from "../store/actions/user.actions"
import { stationService } from "../services/station.service"
import { getPublicStations, getStationsInLibrary, saveStation } from "../store/actions/station.actions"
import { utilService } from "../services/util.service"
import { IndexContext } from '../cmps/IndexContext.jsx'
import { useContext } from "react"
import { svgSvc } from '../services/svg.service.jsx';
import defaultImgUrl from '../assets/imgs/MeloDiva.png'


export function Library({toggleWidth, type = "basic" }) {
    const { setFilterBy } = useContext(IndexContext)
    const stations = useSelector(storeState => storeState.stationModule.stations)
    const userId = useSelector(storeState => storeState.userModule._id)

    async function createNewStation() {
        const name = 'New Playlist'
        const imgUrl = utilService.getImgUrl(defaultImgUrl)
        let newStation = stationService.createStation(name, getCurrentUser(), imgUrl)
        newStation = await saveStation(newStation)
        
        const newFilterBy = {
            tab: 'station',
            collectionId: newStation._id,
            text: '',
        }
      
        setFilterBy(prevFilterBy => ({...stationService.filterByUpdateHistory(prevFilterBy, newFilterBy)}))
    }

    // COMPONENTS
    function LibraryContent({isSkeleton}) {
        if(isSkeleton) return (
            <div className="content">
            <ul>
                <li>
                    <StationPreview station={null} type={type} />
                </li>
            </ul>
        </div>
        )
        return (
            <div className="content">
                <ul>
                    <li>
                        <StationPreview station={getLikedTracksAsStation()} type={type} />
                    </li>
                    {getStationsInLibrary().map(station => {
                        return <li key={`library${station._id}`}>
                            <StationPreview station={station} type={type} />
                        </li>
                    })}
                </ul>
                {getPublicStations().length > 0 && 
                    <p>Public Library</p>
                }
                <ul>
                    {getPublicStations().map(station => {
                        return <div key={`public${station._id}`}>
                            <StationPreview station={station} type={type} />
                        </div>
                    })}
                </ul>
            </div>
        )
    }

    
    return (
        <div className={`library ${type}`}>
            <div className="head">
                <div className="title">
                    <span className="icon-wrapper" onClick={toggleWidth}> <svgSvc.icon.YourLibrary /> </span>
                    <p onClick={toggleWidth}>Your Library</p>
                    <span className="action-button-wrapper add-station-btn" onClick={createNewStation}> <svgSvc.miniMenu.AddToPlaylist /> </span>
                </div>
                <div className="library-search">
                    <span className="button-wrapper"> <svgSvc.general.LibrarySearch style = {{ width: '16px', height: '16px' }} /> </span>
                    <p>Recents</p>
                    <span className="button-wrapper"> <svgSvc.sortBy.List style = {{ width: '16px', height: '16px' }} /> </span>
                </div>
            </div>
            <LibraryContent  isSkeleton={!stations || !userId}/>
        </div>
    )
}
