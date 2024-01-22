import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'
import { stationService } from './station.service.js';
import { ColorLensOutlined } from '@mui/icons-material';

export const categoryService = {
    createCategories,
    saveCategories,
    getCategories,
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
      

    let categories = {
        "1960s-1990s": ["1960s", "1970s", "1980s", "1990s"],
        "2000s-2010s": ["2000s", "2010s"],
        "Electronic, Ambient & Experimental": ["Electronic", "Ambient", "Experimental"],
        "Rock, Blues & Psychedelic": ["Rock", "Blues", "Psychedelic"],
        "Jazz, Trumpet & Bebop": ["Jazz", "Trumpet", "Bebop"],
        "Pop, Hits & Dance": ["Pop", "Hits", "Dance"],
        "R&B, Soul & HipHop": ["R&B", "Soul", "HipHop"],
        "Comedy, Show & Animation": ["Comedy", "Show", "Animation"],
        "Classic, Iconic & Legendary": ["Classic", "Iconic", "Legendary"],
    };

    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33F5", "#57FF33", "#F5FF33", "#33FFF5", "#FF5733"];

          
    let categoriesArray = Object.entries(categories).map(([categoryName, stationsIds], index) => {
        return { categoryName, stationsIds: mergeTags(stationsIds), categoryColor: colors[index % colors.length] };
      });


    saveCategories(categoriesArray);
}


function saveCategories(stats) {
    utilService.saveToStorage(CATEGORIES_STORAGE_KEY, stats)
}

function getCategories() {
    return utilService.loadFromStorage(CATEGORIES_STORAGE_KEY)
}
