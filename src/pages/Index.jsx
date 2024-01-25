import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SideNav } from '../cmps/SideNav.jsx';
import { AppHeader } from '../cmps/AppHeader.jsx';
import { stationService } from '../services/station.service.js';
import { categoryService } from '../services/category.service.js';
import { trackService } from '../services/track.service.js';
import { Search } from './Search.jsx';
import { Library } from './Library.jsx';
import { Home } from './Home.jsx';
import imgUrl from '../assets/imgs/MeloDiva.png'
import { StationDetails } from './StationDetails.jsx';
import { CategoryDisplay } from '../cmps/CategoryDisplay.jsx'
import { initLikedTracks, loadStations } from '../store/actions/station.actions.js';
import { getCurrentTrackInQueue } from '../store/actions/queue.actions.js';
import { IndexContext } from '../cmps/IndexContext.jsx';

export const Index = () => {
    const params = useParams();
    const [indexStationList, setIndexStationList] = useState(null);
    const [filterBy, setFilterBy] = useState(stationService.getDefaultFilter(params));
    const [currentCategory, setCurrentCategory] = useState(null);
    const [selectedTrack, setSelectedTrack] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {   
        loadStationsLocal();
        initLikedTracks()
        categoryService.createCategories();
    }, []);


    useEffect(() => {   
        loadStationsLocal()
        const filterURL = stationService.filterURL(filterBy);
        navigate(filterURL, { replace: true }) 
    }, [filterBy]);

    useEffect(() => {   
        setSelectedTrack(getCurrentTrackInQueue())
    }, [selectedTrack]);

    async function loadStationsLocal() {
        setIndexStationList(await loadStations());
    }

    const mainViewComponentProps = {
        stations: indexStationList,
        setCurrentCategory: setCurrentCategory,
    }; 

    let MainViewComponent;
    switch (params.tab) {
        case 'genre':
            MainViewComponent = CategoryDisplay;
            mainViewComponentProps.category_name = currentCategory;
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
        case 'home':
        default:
            MainViewComponent = Home;
            break;
    }

    
    if (!indexStationList) return <div>Loading...</div>;

    return (
        <IndexContext.Provider value={{ setFilterBy }}>
            <div className="index-container">
                <div className="index-name">
                    <img src={imgUrl} alt="" style={{ width: '100px', height: '100px' }} />
                </div>
                <div className="index-app-header">
                    <AppHeader 
                        setFilterBy={setFilterBy}
                    />
                </div>
                <div className="index-side-nav">
                    <SideNav 
                        setFilterBy={setFilterBy} 
                    />
                </div>
                <div className="index-main-view">
                    <MainViewComponent {...mainViewComponentProps} />
                </div>
                {selectedTrack && <FooterPlayer video={trackService.trackToVideo(selectedTrack)} />}
            </div>
        </IndexContext.Provider>
    );
};
