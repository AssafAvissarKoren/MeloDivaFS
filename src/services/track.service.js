

export const trackService = {
    trackToVideo,
    videoToTrack,
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

function videoToTrack(video) {
    return {
        url: video.id.videoId,
        title: video.snippet.title,
        artist: video.snippet.channelTitle,
        imgUrl: video.snippet.thumbnails.default.url
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
