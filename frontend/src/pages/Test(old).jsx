import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { CategoryDisplay } from '../cmps/CategoryDisplay.jsx';
import { categoryService } from '../services/category.service.js';
import { getStations } from '../store/actions/station.actions.js';

import { dataService } from '../services/data.service.js';
import { imageService } from '../services/image.service.js';
import { PlayAnimation } from '../cmps/PlayAnimation.jsx';
import { saveStation } from '../store/actions/station.actions.js';
import { userService } from '../services/user.service.js';
import { stationService } from '../services/station.service.js';
import { base_dataService } from '../services/base_data.service.js';
import { store } from '../store/store.js';
import { getIsTrackPlaying } from '../store/actions/player.actions.js';
import { pause, play } from "../store/actions/player.actions.js"
import { getCurrentTrackInQueue, setQueueToStation } from '../store/actions/queue.actions.js'
import { svgSvc } from "../services/svg.service.jsx"


export const Test = ({ setCurrentCategory }) => {
    const [testCategory, setTestCategory] = useState(null);
    const dispatch = useDispatch();
    
    const demoCategory = [{
        "_id": "fakeId",
        "name": "",
        "stationIds": [],
        "color": "",
        "image": ""
    }]

    const demoStation = {
        "_id": "s165",
        "name": "The Matrix Soundtrack",
        "artist": "The Matrix",
        "imgUrl": "https://i.ytimg.com/vi/IfRcYLPmegg/sddefault.jpg",
        "tags": [
          "Soundtrack",
          "Electronic",
          "Rock",
          "1990s"
        ],
        "createdBy": {
          "_id": "u115",
          "fullname": "Matthew Lewis",
          "imgUrl": "http://some-photo/"
        },
        "likedByUsers": [
          {
            "_id": "u102",
            "fullname": "Mary Johnson",
            "imgUrl": "http://some-photo/"
          },
          {
            "_id": "u103",
            "fullname": "James Brown",
            "imgUrl": "http://some-photo/"
          }
        ],
        "tracks": [
          {
            "title": "The Matrix Soundtrack Track 1. \"Rock Is Dead\" Marilyn Manson",
            "artist": "Flix Soundtracks",
            "url": "IfRcYLPmegg",
            "imgUrl": "https://i.ytimg.com/vi/IfRcYLPmegg/sddefault.jpg",
            "addedBy": {
              "_id": "u115",
              "fullname": "Matthew Lewis",
              "imgUrl": "http://some-photo/"
            }
          },
          {
            "title": "The Matrix Soundtrack Track 2. \"Spybreak! (Short One)\" Propellerheads",
            "artist": "Flix Soundtracks",
            "url": "-zdAicjlnao",
            "imgUrl": "https://i.ytimg.com/vi/-zdAicjlnao/sddefault.jpg",
            "addedBy": {
              "_id": "u115",
              "fullname": "Matthew Lewis",
              "imgUrl": "http://some-photo/"
            }
          },
        ],
        "mostCommonColor": "#39.f45d1745d17696.ae8ba2e8ba2c5.0ba2e8ba2e88",
        "msgs": [
          {
            "id": "m101",
            "from": {
              "_id": "u115",
              "fullname": "Matthew Lewis",
              "imgUrl": "http://some-photo/"
            },
            "txt": "consectetur nulla exercitation deserunt ex"
          }
        ]
      }
    

    // const BASE_URL = '//localhost:3001'

    // async function colorMeCommon() {
    //     const response = await axios.post(BASE_URL + '/api/getImageColors', { imagePaths: allCat[0].stationIds });
    //     console.log(defaultStations[0])
    //     // Update stations with most common colors
    //     const updatedStations = testCategory.stationIds.map((stationId, index) => {
    //         return {
    //             // ...stations.find(station => station._id === stationId),
    //             ...defaultStations.find(station => station.id === stationId),
    //             mostCommonColor: response.data[index][1]
    //         };
    //     });
    //     console.log(updatedStations[0])
    //     await axios.post(BASE_URL + '/api/updateStations', { updatedStations });
    // }        

    async function showAllStations() {
        try {
            const allCategory = [
                {
                    _id: "c90210", name: "All", stationTags: ["Soundtrack", "Rock", "Electronic", "Blues", "Psychedelic", "Jazz", "Pop", "Dance", 
                    "R&B", "Soul", "Metal", "Comedy", "Show", "Animation", "1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "American", "British"], 
                    color: "#FF00FF", startingPosition: 0, image: "default_thumbnail_url" 
                }
            ]
            const allCat = await categoryService.processCategoryData(allCategory)
            setTestCategory(allCat[0])
            // const ds = await dataService.getDefaultStations()
            // console.log("defaultStations", ds)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    async function getImgUrl(url) {
        try {
            await imageService.downloadImage(url, 'C:\Users\User\Downloads\downloaded_image.jpg')
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // async function getTrackData(stationId) {
    //     try {
    //         const trackData = await dataService.ajaxGetStationTracks(stationId);
    //         console.log("trackData", trackData);
    //     } catch (error) {
    //         console.error("Error fetching data:", error);
    //     }
    // }

    async function getChannelData(channelId) {
        try {
            const channelData = await dataService.fetchChannelData(channelId);
            console.log("channelData", channelData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    async function printStationsImgUrls() {
        const stations = await getStations();
        const stationsImgUrls = stations.map(station => [station._id, station.imgUrl]);
        console.log("stationsImgUrls", stationsImgUrls)
    }

    async function printStationsDurations() {
        const newStation = await dataService.setVideoDurations(demoStation)
        console.log("newStation", newStation)
    }

    async function fixStations() {
        const stations = useSelector(storeState => storeState.stationModule.stations);
    
        try {
            const updatedStations = await Promise.all(stations.map(async station => {
                const updatedStation = await dataService.setVideoDurations(station);
                await saveStation(updatedStation); // Save each updated station individually
                return updatedStation;
            }));
    
            console.log("newStations", updatedStations);
        } catch (error) {
            console.error('Error fixing stations:', error);
        }
    }

    async function printUser() {
        console.log(await userService.getUser())
    }

    async function printStations() {
        console.log(await stationService.getStations())
    }

    async function printStationModule() {
        const stations = store.getState().stationModule.stations
        console.log("printStationModule", stations)
    }

    async function printStation() {
        console.log(await stationService.getById("s165"))
    }

    async function printPre_station() {
        console.log(await base_dataService.getStations())
    }
    
    async function preToStations() {
        base_dataService.createStationData()
    }

    // const stationId = useSelector(state => state.queueModule.station._id);
    // console.log("station", stationId)
    // const queue = useSelector(state => state.queueModule);
    // console.log("queue", queue)
    
    const [isPlaying, setIsPlaying] = useState(false)
    const [isSelected, setSelected] = useState(false)
    const layout = "station-content-layout" //'station-search-track-layout' 'search-track-layout'
    const selected = isSelected ? 'selected' : ''
    const trackNum = 1

    function onToggleSelected(ev) { // problem with the call from handleClickOutside setting the Track, problem with de-selecting the other tracks
        setSelected(prevIsSelected => !prevIsSelected)
    }

    function onTogglePlaying() {
        setIsPlaying(prevIsPlaying => !prevIsPlaying)
    }


    const handleTrackClick = (track) => {
        if(getCurrentTrackInQueue().url === track.url) {
            getIsTrackPlaying() ? dispatch(pause()) : dispatch(play())
        } else {
            setQueueToStation(station, trackNum-1);
        }
    }

    const track = {
        "title": "The Matrix Soundtrack Track 5. \"Prime Audio Soup\" Meat Beat Manifesto",
        "artist": "Flix Soundtracks",
        "url": "hyhfx_XDDdE",
        "imgUrl": "https://i.ytimg.com/vi/hyhfx_XDDdE/sddefault.jpg",
        "addedBy": {
          "_id": "u115",
          "fullname": "Matthew Lewis",
          "imgUrl": "http://some-photo/"
        },
        "duration": "PT6M18S"
      }

    return (
        <div style={{ overflowY: 'scroll' }}>
            <button onClick={() => onTogglePlaying()}>TogglePlaying</button>
            <br />

            <section className={`track-preview ${layout} ${selected}`} onClick={onToggleSelected} >
                <div className='track-number'>
                    <p className='track-num'>{trackNum}</p>
                    <button className="btn-track-play" onClick={() => handleTrackClick(track)}>
                        <span className="action-button-wrapper"> 
                            {(isPlaying && selected) ? <PlayAnimation /> : <svgSvc.player.PlayBtn color={"white"} /> }
                        </span>
                    </button>
                </div>
            </section>

            {/* <button onClick={() => printStation()}>GetStationy1</button>
            <br /> */}
            {/* <button onClick={() => printUser()}>GetUsery1</button>
            <br /> */}
            {/* <PlayAnimation />
            <br />
            <button onClick={() => console.log("station", stationId)}>QueueStation1</button>
            <br />
            <button onClick={() => fixStations()}>FixStations1</button>
            <br />
            <button onClick={() => printStationsDurations()}>SetDurationy1</button>
            <br />
            <button onClick={() => showAllStations()}>AllStation1</button>
            <br />
            <button onClick={() => printStationsImgUrls()}>Station1</button>
            <br />
            <button onClick={() => getImgUrl('https://i.ytimg.com/vi/IfRcYLPmegg/sddefault.jpg')}>Imagy1</button>
            <br />
            <button onClick={() => getTrackData('PLqnnuEVGcRQyQhvsd5Tl47q9JllRqcnGY')}>Tracky1</button>
            <button onClick={() => getTrackData('PLlRF5jS3IgSl15vhFZLl-ZSsNS6ftdnKQ')}>Tracky2</button>
            <br />
            <button onClick={() => getChannelData('UCjEBQ-QfHX0nH2d78h9NT9g')}>Channely1</button>
            <button onClick={() => getChannelData('UC7d6hou24HcG5sA2lwTgV0A')}>Channel1</button> */}

            {/* <div className="test">
                <CategoryDisplay 
                    key={"categoryId"}
                    category={demoCategory}
                    style={categoryService.Status.TEST}
                    setCurrentCategory={setCurrentCategory}
                />
            </div> */}
            {/* {testCategory && 
                <CategoryDisplay
                    key={testCategory._id}
                    category={testCategory}
                    style={categoryService.Status.RESULTS}
                    setCurrentCategory={setCurrentCategory}
                />
            } */}
        </div>
    );
};
