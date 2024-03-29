import React from 'react';
import { useParams } from 'react-router-dom';
import { svgSvc } from '../services/svg.service.jsx';
import { stationService } from '../services/station.service.js';

export const SideNav = ({ setFilterBy, type }) => {
    const params = useParams();
    const tab = params.tab

    const handleTabSelect = (selectedTab) => {
        setFilterBy(prevFilterBy => ({
            ...prevFilterBy, 
            tab: selectedTab,
            tabHistory: [...stationService.removePreviousHistory(prevFilterBy.tabHistory, prevFilterBy.tabHistoryLoc), selectedTab], 
            tabHistoryLoc: prevFilterBy.tabHistoryLoc + 1, 
            collectionId: '' 
        }))
    };

    const tabData = {
        home: { name: "Home", iconActive: <svgSvc.icon.HomeActiveIcon />, icon: <svgSvc.icon.HomeIcon /> },
        search: { name: "Search", iconActive: <svgSvc.icon.SearchActiveIcon />, icon: <svgSvc.icon.SearchIcon /> },
        // test: { name: "Test", iconActive: <svgSvc.icon.CheckIcon />, icon: <svgSvc.icon.CheckIcon /> },
    };

    return (
        <div className={`side-nav ${type}`}>
            {Object.entries(tabData).map(([key, { name, iconActive, icon }]) => {
                return (
                    <div
                        key={key}
                        onClick={() => handleTabSelect(key)}
                        className={key === tab ? 'active' : ''}
                    >
                        <span className={key === tab ? 'icon-wrapper active' : 'icon-wrapper'}>
                            {key === tab ? iconActive : icon}
                        </span>
                        <span className="name-style">{name}</span>
                    </div>
                );
            })}
        </div>
    );
};
