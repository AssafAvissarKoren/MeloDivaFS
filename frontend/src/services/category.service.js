import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'
import { stationService } from './station.service.js';
import { ColorLensOutlined } from '@mui/icons-material';
import defaultImgUrl from '../assets/imgs/MeloDiva.png'
import { httpService } from './http.service.js'

const Status = {
    ROW: 'row',
    CUBE: 'cube',
    RESULTS: 'results',
    TEST: 'test',
  };

export const categoryService = {
    Status,
    createCategories,
    processCategoryData,
    getCategories,
    getCategory,
    removeById,
    saveCategory,
}

const CATEGORY_STORAGE_KEY = 'categoryDB'

const defaultCategories = [
    { _id: "c101", name: "Soundtrack", stationTags: ["Soundtrack"], color: "#FF00FF", startingPosition: 8 },
    { _id: "c102", name: "Rock", stationTags: ["Rock"], color: "#99FF00", startingPosition: 2 },
    { _id: "c103", name: "Electronic", stationTags: ["Electronic"], color: "#FF3300", startingPosition: 7 },
    { _id: "c104", name: "Blues", stationTags: ["Blues"], color: "#00FF66", startingPosition: 6 },
    { _id: "c105", name: "Psychedelic", stationTags: ["Psychedelic"], color: "#00FF99", startingPosition: 3 },
    { _id: "c106", name: "Jazz", stationTags: ["Jazz"], color: "#FF0000", startingPosition: 5 },
    { _id: "c107", name: "Pop", stationTags: ["Pop"], color: "#FF00CC", startingPosition: 6 },
    { _id: "c108", name: "Dance", stationTags: ["Dance"], color: "#FF9900", startingPosition: 1 },
    { _id: "c109", name: "R&B", stationTags: ["R&B"], color: "#FFCC00", startingPosition: 7 },
    { _id: "c110", name: "Soul", stationTags: ["Soul"], color: "#FF00CC", startingPosition: 8 },
    { _id: "c111", name: "Metal", stationTags: ["Metal"], color: "#00FF33", startingPosition: 4 },
    { _id: "c112", name: "Comedy", stationTags: ["Comedy", "Show", "Animation"], color: "#00FF99", startingPosition: 3 },
    { _id: "c113", name: "1960s", stationTags: ["1960s"], color: "#00FF66", startingPosition: 10 },
    { _id: "c114", name: "1970s", stationTags: ["1970s"], color: "#FF3300", startingPosition: 8 },
    { _id: "c115", name: "1980s", stationTags: ["1980s"], color: "#FF9900", startingPosition: 9 },
    { _id: "c116", name: "1990s", stationTags: ["1990s"], color: "#FF0000", startingPosition: 6 },
    { _id: "c117", name: "2000s", stationTags: ["2000s"], color: "#99FF00", startingPosition: 5 },
    { _id: "c118", name: "2010s", stationTags: ["2010s"], color: "#FF00FF", startingPosition: 1 },
    { _id: "c119", name: "American", stationTags: ["American"], color: "#CCFF00", startingPosition: 10 },
    { _id: "c120", name: "British", stationTags: ["British"], color: "#00FFCC", startingPosition: 2 }
];

async function createCategories(categories = defaultCategories) {
    const categoriesArray = await processCategoryData(categories);
    // utilService.saveToStorage(CATEGORY_STORAGE_KEY, categoriesArray);
    await Promise.all(categoriesArray.map(category => saveCategory(category)));    
}

async function saveCategory(category) {
    if (category._id) {
        return await httpService.put(`category/${category._id}`, category)
    } else {
        return await httpService.post(`category/`, category)
    }
}

async function processCategoryData(categories) {
    let stations = await stationService.getStations();
    let tags = {};

    stations.forEach(station => {
        station.tags.forEach(tag => {
            if (!tags[tag]) {
                tags[tag] = [];
            }
            tags[tag].push(station._id);
        });
    });

    const mergeTags = (tagList) => {
        let merged = new Set();
        tagList.forEach(tag => {
          tags[tag]?.forEach(id => merged.add(id));
        });
        return Array.from(merged);
    };
      
    let categoriesArray = categories.flatMap(({ _id, name, stationTags, color, startingPosition }) => {
        const stationIds = mergeTags(stationTags);
        let matchingImageUrl = defaultImgUrl;

        const index = startingPosition % stationIds.length;

        for (let i = index; i < stationIds.length; i++) {
            const stationId = stationIds[i];
            const matchingStation = stations.find(station => station._id === stationId);
            if (matchingStation && matchingStation.imgUrl !== "default_thumbnail_url") {
                matchingImageUrl = matchingStation.imgUrl;
                break;
            }
        }
        return { _id ,name, stationIds: stationIds, color: color, image: matchingImageUrl, startingPosition: startingPosition };
    });

    return categoriesArray;
}

async function getCategory(categoryId) {
    return await httpService.get(`category/${categoryId}`)
    // const categories = await storageService.query(CATEGORY_STORAGE_KEY);
    // return categories.find(category => category._id === categoryId);
}


async function getCategories(filterBy = null) {
    let categories = await httpService.get(`category`)

    // // let categories = await storageService.query(CATEGORY_STORAGE_KEY) // add filter later
    if (!filterBy) return categories

    // apply filtering 
    if (filterBy) {
        if (filterBy.text) {
            categories = categories.filter(category => {
                const textMatch = !filterBy.text || category.name.includes(filterBy.text)
                return textMatch;
            });
        }
    }

    // apply sorting
    switch (filterBy.sort) {
        case 'title':
            categories.sort((a, b) => a.subject.localeCompare(b.subject));
            break;
    }

    return categories
}

async function removeById(categoryId) {
    // return storageService.remove(CATEGORY_STORAGE_KEY, categoryId)
    return await httpService.delete(`category/${categoryId}`)
}

