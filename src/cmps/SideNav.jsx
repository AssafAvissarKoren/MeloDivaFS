import React from 'react';
import { useParams } from 'react-router-dom';
import { iconService } from '../services/buttons.service.jsx';
import { utilService } from '../services/util.service';

export const SideNav = ({ setFilterBy }) => {
    const params = useParams();
    const tab = params.tab

    const handleTabSelect = (selectedTab) => {
        setFilterBy(prev => ({ ...prev, tab: selectedTab , stationId: '' }));
    };

    const baceUrl = "../assets/imgs/"
    const tabData = {
        home: { name: "Home", iconActive: <iconService.HomeActiveIcon />, icon: <iconService.HomeIcon /> },
        search: { name: "Search", iconActive: <iconService.SearchActiveIcon />, icon: <iconService.SearchIcon /> },
        test: { name: "Test", iconActive: <iconService.CheckIcon />, icon: <iconService.CheckIcon /> },
    };


    return (
        <div className="side-nav">
            {Object.entries(tabData).map(([key, { name, iconActive, icon }]) => {
                return (
                    <div
                        key={key}
                        onClick={() => handleTabSelect(key)}
                        className={key === tab ? 'active' : ''}
                    >
                        <span>
                            <span className={key === tab ? 'icon-wrapper active' : 'icon-wrapper'}>
                                {key === tab ? React.cloneElement(iconActive) : React.cloneElement(icon)}
                            </span>
                            <span className="name-style">{name}</span>
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
