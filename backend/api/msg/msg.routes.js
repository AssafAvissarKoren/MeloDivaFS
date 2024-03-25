import express from 'express'
import { getMsg, getMsgs, deleteMsg, addMsg, updateMsg } from './msg.controller.js'
import { requireAdmin } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()

router.get('/', requireAdmin, getMsgs)
router.get('/:msgId', requireAdmin, getMsg)
router.delete('/:msgId', requireAdmin, deleteMsg)
router.post('/', requireAdmin, addMsg)
// router.put('/:msgId', requireAdmin, updateMsg)


export const msgRoutes = router