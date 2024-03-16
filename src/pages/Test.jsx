import React, { useState } from 'react';
import axios from 'axios';
import { CategoryDisplay } from '../cmps/CategoryDisplay';
import { categoryService } from '../services/category.service';
import { getStations } from '../store/actions/station.actions';

import { dataService } from '../services/data.service';
import { imageService } from '../services/image.service';

export const Test = ({ setCurrentCategory }) => {
    const [testCategory, setTestCategory] = useState(null);

    const demoCategory = [{
        "_id": "fakeId",
        "name": "",
        "stationIds": [],
        "color": "",
        "image": ""
    }]

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

    async function getTrackData(stationId) {
        try {
            const trackData = await dataService.ajaxGetStationTracks(stationId);
            console.log("trackData", trackData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

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

    return (
        <div style={{ overflowY: 'scroll' }}>
            
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
            <button onClick={() => getChannelData('UC7d6hou24HcG5sA2lwTgV0A')}>Channel1</button>

            {/* <div className="test">
                <CategoryDisplay 
                    key={"categoryId"}
                    category={demoCategory}
                    style={categoryService.Status.TEST}
                    setCurrentCategory={setCurrentCategory}
                />
            </div> */}
            {testCategory && 
                <CategoryDisplay
                    key={testCategory._id}
                    category={testCategory}
                    style={categoryService.Status.RESULTS}
                    setCurrentCategory={setCurrentCategory}
                />
            }
        </div>
    );
};
