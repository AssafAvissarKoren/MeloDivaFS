import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SideNav } from './SideNav';
import { AppHeader } from './AppHeader';
import { stationService } from '../services/station.service.js';
import { categoryService } from '../services/category.service.js';
import { Search } from '../pages/Search.jsx';
import { Library } from '../pages/Library.jsx';
import { Home } from '../pages/Home.jsx';
import imgUrl from '../assets/imgs/MeloDiva.png'
import { StationDetails } from '../pages/StationDetails.jsx';
import { Category, Status } from '../cmps/Category'

export const Index = () => {
    const params = useParams();
    const [indexStationList, setIndexStationList] = useState(null);
    const [filterBy, setFilterBy] = useState(stationService.getDefaultFilter(params));
    const [currentCategory, setCurrentCategory] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {   
        loadStations();
        categoryService.createCategories();
    }, []);


    useEffect(() => {   
        loadStations();
        const filterURL = stationService.filterURL(filterBy);
        navigate(filterURL, { replace: true }) 
    }, [filterBy]);
    
    async function loadStations() {
        setIndexStationList(await stationService.getStations(filterBy));
    }

    const mainViewComponentProps = {
        stations: indexStationList,
        setCurrentCategory: setCurrentCategory,
    }; 

    let MainViewComponent;
    switch (params.tab) {
        case 'genre':
            MainViewComponent = Category;
            mainViewComponentProps.category_name = currentCategory;
            mainViewComponentProps.style = Status.RESULTS;
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

