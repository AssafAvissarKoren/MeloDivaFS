import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'
import { stationService } from './station.service.js';
import { ColorLensOutlined } from '@mui/icons-material';

export const statsService = {
    createStats,
    saveStats,
    getStats,
}

const STATS_STORAGE_KEY = 'statsDB'

async function createStats() {
    let emails = await stationService.getEmails();
    const folderStats = { "Starred": { total: 0, unread: 0 }};

    emails.forEach(email => {
        const folder = email.folder.charAt(0).toUpperCase() + email.folder.slice(1);
        const isRead = email.isRead;
        const isStarred = email.isStarred;

        if (!folderStats[folder]) {
            folderStats[folder] = { total: 0, unread: 0 };
        }

        folderStats[folder].total += 1;
        if (!isRead) {
            folderStats[folder].unread += 1;
        }
        if(isStarred) {
            folderStats["Starred"].total += 1;
            if (!isRead) {
                folderStats["Starred"].unread += 1;
            }
        }
    });
    saveStats(folderStats)
};

function saveStats(stats) {
    utilService.saveToStorage(STATS_STORAGE_KEY, stats)
}

function getStats() {
    return utilService.loadFromStorage(STATS_STORAGE_KEY)
}


