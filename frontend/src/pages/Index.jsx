import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Search } from './Search.jsx';
import { Library } from './Library.jsx';
import { Home } from './Home.jsx';
import { StationDetails } from './StationDetails.jsx';
import { Test } from './Test.jsx';

import { IndexContext } from '../cmps/IndexContext.jsx';
import { SideNav } from '../cmps/SideNav.jsx';
import { AppHeader } from '../cmps/AppHeader.jsx';
import { CategoryDisplay } from '../cmps/CategoryDisplay.jsx'
import { FooterPlayer } from  '../cmps/FooterPlayer.jsx'

import { editPublicStation, loadStations, removePublicStation } from '../store/actions/station.actions.js';

import { stationService } from '../services/station.service.js';
import { categoryService } from '../services/category.service.js';
import { trackService } from '../services/track.service.js';
import { initUser } from '../store/actions/user.actions.js';
import { playerService } from '../services/player.service.js';
import { useResizer } from '../customHooks/useResizer.js';
import { SOCKET_EVENT_EDIT_PUBLIC_STATION, SOCKET_EVENT_REMOVE_PUBLIC_STATION, socketService } from '../services/socket.service.js';
import { loadCategories } from '../store/actions/category.actions.js';


const MIN_NAV_WIDTH = 280 // px
const MIN_MAIN_WIDTH = 520 // px
const MINI_NAV_WIDTH = 72 // px

export const Index = () => {
    const params = useParams();
    const [filterBy, setFilterBy] = useState(stationService.getDefaultFilter(params));
    const [currentCategory, setCurrentCategory] = useState(null);
    
    const [isSmallScreen, sideNavWidth, isResizing, startResize, toggleMini] = useResizer(MIN_NAV_WIDTH, MIN_MAIN_WIDTH, MINI_NAV_WIDTH)

    const currentTrack = useSelector(state => state.queueModule.currentTrack.track)
    const [trackToPlay, setTrackToPlay] = useState(null)
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            await initUser();
            await loadStationsLocal();
            await loadCategories()
            playerService.initPlayState();
        };
        fetchData();

        setUpSockets()
        return () => {
            removeSockets()
        }
    }, []);
    
    useEffect(() => {
        setTrackToPlay(currentTrack)
    }, [currentTrack]);

    useEffect(() => {
        const filterURL = stationService.filterURL(filterBy);
        navigate(filterURL, { replace: true }) 
    }, [filterBy]);

    function setUpSockets() {
        socketService.on(SOCKET_EVENT_EDIT_PUBLIC_STATION, (station) => editPublicStation(station))
        socketService.on(SOCKET_EVENT_REMOVE_PUBLIC_STATION, (stationId) => removePublicStation(stationId))
    }

    function removeSockets() {
        socketService.off(SOCKET_EVENT_EDIT_PUBLIC_STATION, (station) => editPublicStation(station))
        socketService.off(SOCKET_EVENT_REMOVE_PUBLIC_STATION, (stationId) => removePublicStation(stationId))
    }

    async function loadStationsLocal() {
        await loadStations()
    }

    const mainViewComponentProps = {
        setCurrentCategory: setCurrentCategory,
    }; 

    let MainViewComponent;
    switch (params.tab) {
        case 'genre':
            MainViewComponent = CategoryDisplay;
            mainViewComponentProps.category = currentCategory;
            mainViewComponentProps.style = categoryService.Status.RESULTS;
            break;
        case 'station':
            MainViewComponent = StationDetails;
            break;
        case 'search':
            MainViewComponent = Search;
            mainViewComponentProps.searchText = filterBy.text;
            break;
        case 'library':
            MainViewComponent = Library;
            break;
        case 'test':
            MainViewComponent = Test;
            break;
        case 'home':
        default:
            MainViewComponent = Home;
            break;
    }
    

    if(!isSmallScreen)
        return (
            <IndexContext.Provider value={{ setFilterBy ,setCurrentCategory }}>
                <div className="index-container">
                    <div className="index-side">
                        <div className="index-side-nav" style={{width: `${sideNavWidth}px`}}>
                            <SideNav setFilterBy={setFilterBy} type={sideNavWidth === MINI_NAV_WIDTH ? 'mini' : null}/>
                        </div>
                        <div className="index-side-bottom" style={{width: `${sideNavWidth}px`}}>
                            <Library toggleWidth={toggleMini} type={sideNavWidth === MINI_NAV_WIDTH ? 'mini' : 'basic'}/>
                        </div>
                    </div>
                    <div className="index-side-resizer" onMouseDown={startResize}>
                        <div className={`resizer-line ${isResizing && "unhide"}`}/>
                    </div>
                    <div className="index-main">
                        <AppHeader filterBy={filterBy} setFilterBy={setFilterBy}/>
                        <MainViewComponent {...mainViewComponentProps} />
                    </div>
                    {trackToPlay && <div className="index-footer-player">
                        <FooterPlayer 
                            video={trackService.trackToVideo(trackToPlay)}
                        />
                    </div>}
                </div>
            </IndexContext.Provider>
        );
    return (
        <IndexContext.Provider value={{ setFilterBy ,setCurrentCategory }}>
            <div className="index-container">
                <div className="index-main">
                    <AppHeader filterBy={filterBy} setFilterBy={setFilterBy}/>
                    <MainViewComponent {...mainViewComponentProps} />
                </div>
                {trackToPlay && <div className="index-footer-player">
                    <FooterPlayer 
                        video={trackService.trackToVideo(trackToPlay)}
                    />
                </div>}
                <div className="index-side">
                    <div className="index-side-nav">
                        <SideNav setFilterBy={setFilterBy} type={"small-screen"}/>
                    </div>
                </div>
            </div>
        </IndexContext.Provider>
    );
};
