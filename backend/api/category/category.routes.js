import express from 'express'
import { getSettings, addCategory, getCategory, getCategories, removeCategory, updateCategory } from './category.controller.js'
import { log } from '../../middlewares/log.middleware.js'
import { requireUser } from '../../middlewares/requireAuth.middleware.js'
import { categoryService } from './category.service.js'

const router = express.Router()

// const getCreatorCategoryId = async (req, res) => {
//     const { categoryId } = req.params;
//     try {
//         const category = await categoryService.getById(categoryId);
//         console.log('category:', category);
//         return category.creator._id;
//     } catch (error) {
//         console.error('Error fetching category:', error);
//         res.status(500).send('Internal Server Error');
//     }
// };

router.get('/settings', getSettings) //log, 
router.get('/', getCategories) //log, 
router.get('/:categoryId', getCategory) //log, 
router.delete('/:categoryId', removeCategory); //log, async (req, res, next) => {requireUser(req, res, next, await getCreatorCategoryId(req, res))}, 
router.post('/', addCategory); //log, requireUser, 
router.put('/:categoryId', updateCategory); //log, async (req, res, next) => {requireUser(req, res, next, await getCreatorCategoryId(req, res))}, 

export const categoryRoutes = router
