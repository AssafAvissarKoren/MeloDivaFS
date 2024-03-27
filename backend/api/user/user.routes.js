import express from 'express'
import { getUser, getUsers, deleteUser, addUser, updateUser } from './user.controller.js'
import { requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/log.middleware.js'

const router = express.Router()

const getCreatorUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await userService.getById(userId);
        console.log('user:', user);
        return user.creator._id;
    } catch (error) {
        console.error('Error fetching bug:', error);
        res.status(500).send('Internal Server Error');
    }
};

router.post('/', log('Creating User'), addUser)
router.get('/', log('Getting Users'), getUsers)
router.get('/:userId', log('Getting User'), getUser)
router.put('/:userId', log('Updating User'), updateUser) //requireAdmin, 
router.delete('/:userId', log('Deleting User'), deleteUser)

export const userRoutes = router