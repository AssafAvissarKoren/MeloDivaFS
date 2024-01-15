import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SideNav } from './SideNav';
import { AppHeader } from './AppHeader';
import { songService } from '../services/track.service';
import { statsService } from '../services/stats.service';
import { Outlet } from 'react-router-dom';

export const Index = () => {
    const params = useParams();
    const [indexSongList, setIndexSongList] = useState(null);
    const [filterBy, setFilterBy] = useState(songService.getDefaultFilter(params));

    const navigate = useNavigate();

    useEffect(() => {
        songService.initSongs()
    }, []);

    useEffect(() => {   
        loadSongs();
        const filterURL = songService.filterURL(filterBy);
        navigate(filterURL, { replace: true }); 
    }, [filterBy]);
    
    async function loadSongs() {
        const newEmailList = await songService.queryEmails(filterBy)
        setIndexSongList(newEmailList);
        // await statsService.createStats();
    }
    
    if (!indexSongList) return <div>Loading...</div>;

    return (
            <div className="index-container">
                <div className="name">
                    <h1>MeloDiva</h1>
                </div>
                <div className="app-header">
                    <AppHeader 
                        setFilterBy={setFilterBy}
                    />
                </div>
                <div className="side-nav">
                    <SideNav />
                </div>
                <div className="main-view">
                    <Outlet />
                </div>
            </div>
    );
};

