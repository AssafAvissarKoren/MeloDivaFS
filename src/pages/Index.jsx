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

import { loadStations } from '../store/actions/station.actions.js';
import { getCurrentTrackInQueue } from '../store/actions/queue.actions.js';

import { stationService } from '../services/station.service.js';
import { categoryService } from '../services/category.service.js';
import { trackService } from '../services/track.service.js';
import { initUser } from '../store/actions/user.actions.js';

const MIN_NAV_WIDTH = 280 // px
let maxNavWidth = window.innerWidth - 500 - 20 // px

export const Index = () => {
    const params = useParams();
    const [filterBy, setFilterBy] = useState(stationService.getDefaultFilter(params));
    const [currentCategory, setCurrentCategory] = useState(null);
    const selectedTrack = useSelector(storeState => storeState.queueModule.playedTracks)
    
    const [sideNavWidth, setSideNavWidth] = useState(MIN_NAV_WIDTH)

    const navigate = useNavigate();


    useEffect(() => {
        loadStationsLocal();
        initUser()
        categoryService.createCategories();
    }, []);

    useEffect(() => {
        const filterURL = stationService.filterURL(filterBy);
        navigate(filterURL, { replace: true }) 
    }, [filterBy]);

    useEffect(() => {
        const handleResize = () => {
            maxNavWidth = window.innerWidth - 500 - 20
            if(sideNavWidth < MIN_NAV_WIDTH) setSideNavWidth(MIN_NAV_WIDTH)
            if(sideNavWidth > maxNavWidth) setSideNavWidth(maxNavWidth)
        };
    
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
    }, [sideNavWidth]);


    async function loadStationsLocal() {
        await loadStations()
    }

    const mainViewComponentProps = {
        setCurrentCategory: setCurrentCategory,
    }; 

    function startResize(ev) {
        ev.preventDefault();

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', stopResize);
    }

    function handleMouseMove(ev) {
        if(ev.clientX >= MIN_NAV_WIDTH && ev.clientX <= maxNavWidth) 
            setSideNavWidth(ev.clientX)
    }

    function stopResize() {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', stopResize);
    }

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
        case 'test':
            MainViewComponent = Test;
            break;
        case 'home':
        default:
            MainViewComponent = Home;
            break;
    }

    return (
        <IndexContext.Provider value={{ setFilterBy }}>
            <div className="index-container">
                <div className="index-side-nav" style={{width: `${sideNavWidth}px`}}>
                    <SideNav 
                        setFilterBy={setFilterBy} 
                    />
                </div>
                <div className="index-side-bottom" style={{width: `${sideNavWidth}px`}}>

                    <Library/>
                </div>
                <div className="index-main-view">
                    <AppHeader 
                        setFilterBy={setFilterBy}
                    />
                    <MainViewComponent {...mainViewComponentProps} />
                </div>
                {selectedTrack && <div className="index-footer-player">
                    <FooterPlayer video={trackService.trackToVideo(selectedTrack)} />
                </div>}
                <div className="index-side-resizer" style={{marginLeft: `${sideNavWidth - 10}px`}} onMouseDown={startResize}/>
            </div>
        </IndexContext.Provider>
    );
};
