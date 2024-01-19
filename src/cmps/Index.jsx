import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SideNav } from './SideNav';
import { AppHeader } from './AppHeader';
import { stationService } from '../services/station.service.js';
import { Search } from '../pages/Search.jsx';
import { Library } from '../pages/Library.jsx';
import { Home } from '../pages/Home.jsx';
import imgUrl from '../assets/imgs/MeloDiva.png'
import { Station } from '../pages/Station.jsx';

export const Index = () => {
    const params = useParams();
    const [indexStationList, setIndexStationList] = useState(null);
    const [filterBy, setFilterBy] = useState(stationService.getDefaultFilter(params));

    const navigate = useNavigate();

    useEffect(() => {   
        loadStations();
        const filterURL = stationService.filterURL(filterBy);
        navigate(filterURL, { replace: true }) 
    }, [filterBy]);
    
    async function loadStations() {
        const newStationList = await stationService.getStations(filterBy)
        setIndexStationList(newStationList);
        // await statsService.createStats();
    }

    const mainViewComponentProps = {}; 

    let MainViewComponent;
    switch (params.tab) {
        case 'station':
            MainViewComponent = Station;
            break;
        case 'search':
            MainViewComponent = Search;
            mainViewComponentProps.searchText = filterBy.text; // Pass 'text' from 'filterBy' to Search
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
            </div>
    );
};

