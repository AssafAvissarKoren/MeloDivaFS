import { useState, useEffect } from 'react';
import { stationService } from '../services/station.service';
import imgUrl from '../assets/imgs/react.png'
import { StationPreview } from '../cmps/StationPreview';

export function Home() {
    const [stations, setStations] = useState(null);

    useEffect(() => {   
        loadStations();
    }, []);

    async function loadStations() {
        const newStationsList = await stationService.getStations()
        console.log("newStationsList", newStationsList)
        setStations(newStationsList);
    }


    if (!stations) return <div>Loading...</div>;

    return (
        <section className="home">
            <h1 style={{color: "white"}}>Welcome to the Home Page</h1>
            {stations && 
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    < StationPreview station={stations[0]}/>
                    < StationPreview station={stations[1]}/>
                </div>
            }
            <img src={imgUrl} alt="" />
        </section>
    )
}
