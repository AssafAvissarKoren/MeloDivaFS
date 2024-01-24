import { storageService } from './async-storage.service.js'
import { createLikedTracksData } from './data.service.js';

export const trackService = {
    initLikedTracks,
    setLikedTracks,
    getLikedTrack,
    createTrack,
    trackToVideo,
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

async function getLikedTrack(likedTracksId) {
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

function trackToVideo(track, artist) {
    return {
        id: {
            videoId: track.url
        },
        snippet: {
            title: track.title,
            channelTitle: artist,
            thumbnails: {
                default: {
                    url: track.imgUrl
                }
            }
        }
    };
}


// function trackToVideo(track, artist) {
//     return {
//         "kind": "youtube#searchResult",
//         "etag": "", // etag can be an empty string if not available
//         "id": {
//             "kind": "youtube#video",
//             "videoId": track.url
//         },
//         "snippet": {
//             "publishedAt": "", // You can set this to an empty string or a default date if not available
//             "channelId": "", // channelId can be an empty string if not available
//             "title": track.title,
//             "description": "", // description can be an empty string or a default value if not available
//             "thumbnails": {
//                 "default": {
//                     "url": track.imgUrl,
//                     "width": 120, // Default thumbnail width
//                     "height": 90 // Default thumbnail height
//                 },
//                 "medium": {}, // You can leave other thumbnail sizes empty if not needed
//                 "high": {}
//             },
//             "channelTitle": artist,
//             "liveBroadcastContent": "none", // Assuming it's not a live content
//             "publishTime": "" // You can set this to an empty string or a default date if not available
//         }
//     };
// }
