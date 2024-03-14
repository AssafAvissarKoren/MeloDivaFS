import React from 'react';
import { CategoryDisplay } from '../cmps/CategoryDisplay';
import { categoryService } from '../services/category.service';
import { dataService } from '../services/data.service';
import { imageService } from '../services/image.service';

export const Test = ({ setCurrentCategory }) => {

    const demoCategory = [{
        "_id": "fakeId",
        "name": "",
        "stationIds": [],
        "color": "",
        "image": ""
    }]

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

    return (
        <div> 
            <button onClick={() => getImgUrl('https://i.ytimg.com/vi/IfRcYLPmegg/sddefault.jpg')}>Imagy1</button>
            <br />
            <button onClick={() => getTrackData('PLqnnuEVGcRQyQhvsd5Tl47q9JllRqcnGY')}>Tracky1</button>
            <button onClick={() => getTrackData('PLlRF5jS3IgSl15vhFZLl-ZSsNS6ftdnKQ')}>Tracky2</button>
            <br />
            <button onClick={() => getChannelData('UCjEBQ-QfHX0nH2d78h9NT9g')}>Channely1</button>
            <button onClick={() => getChannelData('UC7d6hou24HcG5sA2lwTgV0A')}>Channel1</button>

            <div className="test">
                <CategoryDisplay 
                    key={"categoryId"}
                    category={demoCategory}
                    style={categoryService.Status.TEST}
                    setCurrentCategory={setCurrentCategory}
                />
            </div>
        </div>
    );
};
