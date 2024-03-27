import express from 'express'
import { getQueries, getQuery, removeQuery, addQuery, updateQuery } from './query.controller.js'
import { log } from '../../middlewares/log.middleware.js'
import { requireUser } from '../../middlewares/requireAuth.middleware.js'

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

router.post('/', log('Creating Query'), addQuery);
router.get('/', log('Getting Queries'), getQueries)
router.get('/:queryId', log('Getting Query'), getQuery)
router.put('/:queryId', log('Updating Query'), updateQuery);
router.delete('/:queryId', log('Deleting Query'), removeQuery);

export const queryRoutes = router
