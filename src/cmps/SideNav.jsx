import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faBook, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { utilService } from '../services/util.service';

export const SideNav = ({ setFilterBy }) => {
    const params = useParams();
    const tab = params.tab

    // useEffect(() => {
    //     setFilterBy(prev => ({ ...prev, tab }));
    // }, [tab, setFilterBy]);

    const handleTabSelect = (selectedTab) => {
        setFilterBy(prev => ({ ...prev, tab: selectedTab , stationId: '' }));
    };

    const baceUrl = "../assets/imgs/"
    const tabData = {
        home: { name: "Home", regular: `${baceUrl}home.svg`, active: `${baceUrl}homeSolid.svg` },
        search: { name: "Search", regular: `${baceUrl}search.svg`, active: `${baceUrl}searchSolid.svg` },
        test: { name: "Test", regular: `${baceUrl}plus.svg`, active: `${baceUrl}plus.svg` },
    };


    return (
        <div className="side-nav">
            {Object.entries(tabData).map(([key, { name, regular, active }]) => {
                return (
                    <div
                        key={key}
                        onClick={() => handleTabSelect(key)}
                        className={key === tab ? 'active' : ''}
                    >
                        <img
                            className="symbol"
                            src={key === tab ? utilService.getImgUrl(active) : utilService.getImgUrl(regular)}
                            alt={`${name} svg`}
                        />
                        <span className="name-style">{name}</span>
                    </div>
                );
            })}
        </div>
    );
};
