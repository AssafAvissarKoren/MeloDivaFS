import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'
import { stationService } from './station.service.js';
import { ColorLensOutlined } from '@mui/icons-material';
import defaultImgUrl from '../assets/imgs/MeloDiva.png'

const Status = {
    ROW: 'row',
    CUBE: 'cube',
    RESULTS: 'results',
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
        {_id: "c101", name: "1960s-1990s", stationTags: ["1960s", "1970s", "1980s", "1990s"], color: "#FFC864"},
        {_id: "c102", name: "2000s-2010s", stationTags: ["2000s", "2010s"], color: "#779DC3"},
        {_id: "c103", name: "Electronic, Ambient & Experimental", stationTags: ["Electronic", "Ambient", "Experimental"], color: "#E8115B"},
        {_id: "c104", name: "Rock, Blues & Psychedelic", stationTags: ["Rock", "Blues", "Psychedelic"], color: "#1E3264"},
        {_id: "c105", name: "Jazz, Trumpet & Bebop", stationTags: ["Jazz", "Trumpet", "Bebop"], color: "#80433B"},
        {_id: "c106", name: "Pop, Hits & Dance", stationTags: ["Pop", "Hits", "Dance"], color: "#E13300"},
        {_id: "c107", name: "R&B, Soul & HipHop", stationTags: ["R&B", "Soul", "HipHop"], color: "#1BD57F"},
        {_id: "c108", name: "Comedy, Show & Animation", stationTags: ["Comedy", "Show", "Animation"], color: "#EEC1C9"},
        {_id: "c109", name: "Classic, Iconic & Legendary", stationTags: ["Classic", "Iconic", "Legendary"], color: "#046FBC"},
    ]     

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
