import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faBook } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export const SideNav = ({ setFilterBy }) => {
    const params = useParams();
    const tab = params.tab

    useEffect(() => {
        setFilterBy(prev => ({ ...prev, tab }));
    }, [tab, setFilterBy]);

    const handleTabSelect = (selectedTab) => {
        setFilterBy(prev => ({ ...prev, tab: selectedTab , stationId: '' }));
    };

    const tabData = {
        home: { name: "Home", icon: faHome, symbol: "" },
        search: { name: "Search", icon: faSearch, symbol: "" },
        library: { name: "Library", icon: faBook, symbol: "||∖" }
    };
    

    return (
        <div className="side-nav">
            {Object.entries(tabData).map(([key, { name, icon, symbol }]) => {
                return (
                    <div
                        key={key}
                        onClick={() => handleTabSelect(key)}
                        className={key === tab ? 'active' : ''}
                    >
                        <span>
                            {icon ? (
                                <FontAwesomeIcon icon={icon} className="symbol" aria-hidden="true" />
                            ) : (<span className="symbol">{symbol}</span>) }
                            <span className="name-style">{name}</span>
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
