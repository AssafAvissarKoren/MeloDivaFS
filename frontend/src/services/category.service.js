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
    getCategories,
    getCategory,
    removeById,
    saveCategory,
}

const CATEGORY_STORAGE_KEY = 'categoryDB'


async function saveCategory(category) {
    if (category._id) {
        return await httpService.put(`category/${category._id}`, category)
    } else {
        return await httpService.post(`category/`, category)
    }
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

