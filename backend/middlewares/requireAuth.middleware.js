import { authService } from "../api/auth/auth.service.js"
import { loggerService } from './../services/logger.service.js'


export function requireUser(req, res, next, entityId = null) {
    const loggedinUser = authService.validateToken(req.cookies.loginToken);
    if (loggedinUser && (!entityId || loggedinUser._id === entityId || loggedinUser.isAdmin)) {
        req.loggedinUser = loggedinUser;
        loggerService.info('Sample requireUser request');
        next();
    } else {
        return res.status(401).send('Not authenticated');
    }
}

export function requireAdmin(req, res, next) {
	const loggedinUser = authService.validateToken(req.cookies.loginToken)
	if (!loggedinUser) return res.status(401).send('Not authenticated')
	if (!loggedinUser.isAdmin) {
		loggerService.warn(`${loggedinUser.username} tried to perform an admin action`)
		return res.status(403).send(`Not autorized`)
	}

	req.loggedinUser = loggedinUser
	loggerService.info('Sample requireAdmin request')
	next()
}