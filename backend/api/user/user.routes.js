import express from 'express'
import { getUser, getUsers, deleteUser, addUser, updateUser } from './user.controller.js'
import { requireAdmin } from '../../middlewares/requireAuth.middleware.js'

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

router.get('/', getUsers)
router.get('/:userId', getUser)
router.delete('/:userId', deleteUser)
router.post('/', addUser)
router.put('/:userId', updateUser) //requireAdmin, 


export const userRoutes = router