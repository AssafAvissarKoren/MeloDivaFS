import imgTLI from '../assets/imgs/the lonely island - tutleneck & chain.png';
import { storageService } from './async-storage.service.js'
import { createLikedTracksData } from './data.service.js';
import { utilService } from './util.service.js'

export const trackService = {
    initLikedTracks,
    setLikedTracks,
    getLikedTrack,
    createTrack,

    //===TRASH===
    queryEmails,
    filterURL,
    getDefaultFilter,
    initSongs,
}

const LIKED_TRACK_STORAGE_KEY = 'trackDB'

createLikedTracksData(LIKED_TRACK_STORAGE_KEY)

async function initLikedTracks(likedTracks) {
    likedTracks = await storageService.query(LIKED_TRACK_STORAGE_KEY)
    return likedTracks[0]
}

function setLikedTracks(likedTracks) {
    storageService.put(LIKED_TRACK_STORAGE_KEY, likedTracks)
}

async function getLikedTrack() {
    return storageService.get(LIKED_TRACK_STORAGE_KEY, likedTracksId)
}

function createTrack(track, addedBy) {
    const snippet = track.snippet || {};
    const resourceId = snippet.resourceId || {};
    const thumbnails = snippet.thumbnails || {};
    const standard = thumbnails.standard || {};

    return {
        title: snippet.title || 'Unknown Title',
        url: resourceId.videoId || 'Unknown Video ID',
        imgUrl: standard.url || 'default_thumbnail_url', // Replace with a default thumbnail URL
        addedBy: addedBy
    };
}

//=================================
//============ TRASH ==============
//=================================

async function initSongs() {
    const savedSongs = defaultContent.map(song => ({
        ...song,
        coverImage: imgTLI,
        likes: 0,
      }));
    utilService.saveToStorage(SONG_STORAGE_KEY, savedSongs);
    // statsService.createStats();
}
    
const defaultContent = [
    { _id: "GI6CfKcMhjY", title: "Jack Sparrow", artist: "The Lonely Island", featuredArtist: ["Michael Bolton"] },
    { _id: "Jr9Kaa1sycs", title: "Finest Girl (Bin Laden Song) - Uncensored Version", artist: "The Lonely Island", featuredArtist: [] },
    { _id: "BKQ6nINAeq8", title: "Go Kindergarten", artist: "The Lonely Island", featuredArtist: ["Robyn", "Sean Combs", "Paul Rudd"] },
    { _id: "avaSdC0QOUM", title: "I'm On A Boat", artist: "The Lonely Island", featuredArtist: ["T-Pain"] },
    { _id: "8yvEYKRF5IA", title: "Boombox", artist: "The Lonely Island", featuredArtist: ["Julian Casablancas"] },
    { _id: "NisCkxU544c", title: "Like A Boss", artist: "The Lonely Island", featuredArtist: ["Seth Rogen"] },
    { _id: "jUw4Qh9uFK8", title: "Spring Break Anthem", artist: "The Lonely Island", featuredArtist: [] }
  ];

async function queryEmails(filterBy) {
    let emails = await songService.query();

    // Apply filtering based on the provided filter criteria
    if (filterBy) {
        if (filterBy.folder) {
            if (filterBy.folder === 'starred') {
                emails = emails.filter(email => email.isStarred);
            } else {
                emails = emails.filter(email => email.folder === filterBy.folder);
            }
        }

        if (filterBy.text || filterBy.isRead !== null) {
            emails = emails.filter(email => {
                const textMatch = !filterBy.text || email.subject.includes(filterBy.text) || email.body.includes(filterBy.text) || email.from.includes(filterBy.text);
                const isReadMatch = filterBy.isRead === null || email.isRead === filterBy.isRead;
                return textMatch && isReadMatch;
            });
        }
    }

    // Sort the emails based on the filter criteria
    switch (filterBy.sort) {
        case 'date':
            emails.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
            break;
        case 'title':
            emails.sort((a, b) => a.subject.localeCompare(b.subject));
            break;
        // Add more sort cases if necessary
    }

    // Link emails with their next and previous emails
    if (emails.length > 0) {
        emails[0].prevEmailId = null;
        emails[0].listIndex = 1; // Start index at 1

        for (let i = 1; i < emails.length; i++) {
            emails[i].prevEmailId = emails[i - 1].id;
            emails[i - 1].nextEmailId = emails[i].id;
            emails[i].listIndex = i + 1;
        }

        emails[emails.length - 1].nextEmailId = null; // Last email's nextEmailId is null
    }

    return emails;
}

function filterURL(filterBy) {
    let url = `/melodiva/${filterBy.folder || 'inbox'}`;
    const queryParams = new URLSearchParams();

    if (filterBy.text) {
        queryParams.append('text', filterBy.text);
    }
    if (filterBy.isRead !== null) {
        queryParams.append('isRead', filterBy.isRead);
    }
    if (filterBy.sort) {
        queryParams.append('sort', filterBy.sort);
    }
    if ([...queryParams].length) {
        url += `?${queryParams}`;
    }
    return url;
}

function getDefaultFilter(params) {
    return {
        folder: params.tab || "home",
        text: params.text || "",
        isRead: params.isRead !== undefined ? params.isRead : null,
        sort: params.sort || "",
    };
}
