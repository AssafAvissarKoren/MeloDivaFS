import express from 'express'
import { getSettings, addCategory, getCategory, getCategories, removeCategory, updateCategory } from './category.controller.js'
import { log } from '../../middlewares/log.middleware.js'
import { requireUser } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()

router.post('/', log('Creating Category'), addCategory);
router.get('/settings', log('Getting Category Settings'), getSettings)
router.get('/', log('Getting Categories'), getCategories)
router.get('/:categoryId', log('Getting Category'), getCategory)
router.put('/:categoryId', log('Updating Categories'), updateCategory);
router.delete('/:categoryId', log('Deleting Category'), removeCategory);

export const categoryRoutes = router
