import express from 'express'
import { getSettings, addBug, getBug, getBugs, removeBug, updateBug } from './bug.controller.js'
import { log } from '../../middlewares/log.middleware.js'
import { requireUser } from '../../middlewares/requireAuth.middleware.js'
import { bugService } from './bug.service.js'

const router = express.Router()

const getCreatorBugId = async (req, res) => {
    const { bugId } = req.params;
    try {
        const bug = await bugService.getById(bugId);
        console.log('bug:', bug);
        return bug.creator._id;
    } catch (error) {
        console.error('Error fetching bug:', error);
        res.status(500).send('Internal Server Error');
    }
};

router.get('/settings', log, getSettings)
router.get('/', log, getBugs)
router.get('/:bugId', log, getBug)
router.delete('/:bugId', log, async (req, res, next) => {requireUser(req, res, next, await getCreatorBugId(req, res))}, removeBug);
router.post('/', log, requireUser, addBug);
router.put('/:bugId', log, async (req, res, next) => {requireUser(req, res, next, await getCreatorBugId(req, res))}, updateBug);

export const bugRoutes = router
