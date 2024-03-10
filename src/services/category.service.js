import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'
import { stationService } from './station.service.js';
import { ColorLensOutlined } from '@mui/icons-material';
import defaultImgUrl from '../assets/imgs/MeloDiva.png'

const Status = {
    ROW: 'row',
    CUBE: 'cube',
    RESULTS: 'results',
    TEST: 'test',
  };

export const categoryService = {
    Status,
    createCategories,
    getCategories,
    removeById,
    saveCategory,
}

const CATEGORIES_STORAGE_KEY = 'categoryDB'
  
async function createCategories() {
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
      
    let categories = [
        {_id: "c101", name: "Soundtrack", stationTags: ["Soundtrack"], color: "#FF00FF"},
        {_id: "c102", name: "Rock", stationTags: ["Rock"], color: "#FF00CC"},
        {_id: "c103", name: "Electronic", stationTags: ["Electronic"], color: "#FF0099"},
        {_id: "c104", name: "Blues", stationTags: ["Blues"], color: "#FF0066"},
        {_id: "c105", name: "Psychedelic", stationTags: ["Psychedelic"], color: "#FF0033"},
        {_id: "c106", name: "Jazz", stationTags: ["Jazz"], color: "#FF0000"},
        {_id: "c107", name: "Pop", stationTags: ["Pop"], color: "#FF3300"},
        {_id: "c108", name: "Dance", stationTags: ["Dance"], color: "#FF6600"},
        {_id: "c109", name: "R&B", stationTags: ["R&B"], color: "#FF9900"},
        {_id: "c110", name: "Soul", stationTags: ["Soul"], color: "#FFCC00"},
        {_id: "c111", name: "Metal", stationTags: ["Metal"], color: "#FFFF00"},
        {_id: "c112", name: "Comedy", stationTags: ["Comedy", "Show", "Animation"], color: "#CCFF00"},
        {_id: "c113", name: "1960s", stationTags: ["1960s"], color: "#99FF00"},
        {_id: "c114", name: "1970s", stationTags: ["1970s"], color: "#66FF00"},
        {_id: "c115", name: "1980s", stationTags: ["1980s"], color: "#33FF00"},
        {_id: "c116", name: "1990s", stationTags: ["1990s"], color: "#00FF00"},
        {_id: "c117", name: "2000s", stationTags: ["2000s"], color: "#00FF33"},
        {_id: "c118", name: "2010s", stationTags: ["2010s"], color: "#00FF66"},
        {_id: "c119", name: "American", stationTags: ["American"], color: "#00FF99"},
        {_id: "c120", name: "British", stationTags: ["British"], color: "#00FFCC"},
    ];

    let categoriesArray = categories.flatMap(({ _id, name, stationTags, color }) => {
        const stationIds = mergeTags(stationTags);
        let matchingImageUrl = defaultImgUrl;
        for (let i = 0; i < stationIds.length; i++) {
            const stationId = stationIds[i];
            const matchingStation = stations.find(station => station._id === stationId);
            if (matchingStation && matchingStation.imgUrl !== "default_thumbnail_url") {
                matchingImageUrl = matchingStation.imgUrl;
                break;
            }
        }
        return { _id ,name, stationIds: stationIds, color: color, image: matchingImageUrl };
    });

    
    utilService.saveToStorage(CATEGORIES_STORAGE_KEY, categoriesArray)
    return categoriesArray
}

async function getCategories(filterBy = null) {
    let categories = await storageService.query(CATEGORIES_STORAGE_KEY) // add filter later
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

function removeById(categoryId) {
    return storageService.remove(CATEGORY_STORAGE_KEY, categoryId)
}

function saveCategory(category) {
    if (category._id) {
        return storageService.put(CATEGORY_STORAGE_KEY, category)
    } else {
        return storageService.post(CATEGORY_STORAGE_KEY, category)
    }
}
