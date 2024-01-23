import axios from "axios"
import { LoremIpsum } from 'lorem-ipsum';
import { trackService } from "./track.service"
import { utilService } from "./util.service"

export async function createStationData(storageKey) {
    let stations = utilService.loadFromStorage(storageKey);

    if (!stations || !stations.length) {
        stations = [];
        
        for (const { id, name, createdBy, tags, playlistId } of defaultStations) {
            const newStation = await createStation(id, name, createdBy, tags, playlistId);
            stations.push(newStation);
        }

        utilService.saveToStorage(storageKey, stations);
    }
}

export async function createLikedTracksData(storageKey) {
    let stations = utilService.loadFromStorage(storageKey);
    if (!stations || !stations.length) utilService.saveToStorage(storageKey, [{_id: 'l101'}]);
}

const API_KEY = 'AIzaSyD5_pPOj9mwAPQz41a1ymh9AuhbZxS6ySQ'
const STATION_API_URL = 'https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50'
const lorem = new LoremIpsum();

async function createStation(stationId, name, createdBy, tags, playlistId) {
    let tracks = await ajaxGetStationTracks(playlistId);
    tracks = tracks.map(track => trackService.createTrack(track, createdBy));

    return {
        _id: stationId,
        name,
        imgUrl: tracks.length > 0 ? tracks[0].imgUrl : 'blank',
        tags,
        createdBy,
        likedByUsers: [Users.User2, Users.User3],
        tracks,
        msgs: [
            {
                id: 'm101',
                from: createdBy,
                txt: lorem.generateWords(5),
            }
        ]
    };
}

async function ajaxGetStationTracks(stationId) {
    try {
        const res = await axios.get(`${STATION_API_URL}&playlistId=${stationId}&key=${API_KEY}`)
        return res.data.items
    } catch (err) {
        console.error(err)
        throw err
    }
}

const Users = {
    u01: { _id: "u101", fullname: "Duran Duran", imgUrl: "http://some-photo/" },
    u02: { _id: "u102", fullname: "Bob Ross", imgUrl: "http://some-photo/" },
    u03: { _id: "u103", fullname: "Mike Tyson", imgUrl: "http://some-photo/" },
    u04: { _id: "u104", fullname: "John Lenon", imgUrl: "http://some-photo/" },
    u05: { _id: "u105", fullname: "David Bowie", imgUrl: "http://some-photo/" },
    u06: { _id: "u106", fullname: "Freddie Mercury", imgUrl: "http://some-photo/" },
    u07: { _id: "u107", fullname: "Elvis Presley", imgUrl: "http://some-photo/" },
    u08: { _id: "u108", fullname: "Aretha Franklin", imgUrl: "http://some-photo/" },
    u09: { _id: "u109", fullname: "Madonna", imgUrl: "http://some-photo/" },
    u10: { _id: "u110", fullname: "George Michael", imgUrl: "http://some-photo/" },
    u11: { _id: "u111", fullname: "Devo", imgUrl: "http://some-photo/" },
    u12: { _id: "u112", fullname: "Petshop Boys", imgUrl: "http://some-photo/" },
    u13: { _id: "u113", fullname: "Janis Joplin", imgUrl: "http://some-photo/" },
    u14: { _id: "u114", fullname: "Louis Armstrong", imgUrl: "http://some-photo/" },
    u15: { _id: "u115", fullname: "Nina Simone", imgUrl: "http://some-photo/" },
    u16: { _id: "u116", fullname: "Ray Charles", imgUrl: "http://some-photo/" },
    u17: { _id: "u117", fullname: "Jimi Hendrix", imgUrl: "http://some-photo/" },
    u18: { _id: "u118", fullname: "Ella Fitzgerald", imgUrl: "http://some-photo/" },
    u19: { _id: "u119", fullname: "Chuck Berry", imgUrl: "http://some-photo/" },
    u20: { _id: "u120", fullname: "Etta James", imgUrl: "http://some-photo/" },
    u21: { _id: "u121", fullname: "Miles Davis", imgUrl: "http://some-photo/" },
    u22: { _id: "u122", fullname: "Billie Holiday", imgUrl: "http://some-photo/" },
    u23: { _id: "u123", fullname: "Charlie Parker", imgUrl: "http://some-photo/" },
    u24: { _id: "u124", fullname: "Dizzy Gillespie", imgUrl: "http://some-photo/" }
};

const defaultStations = [
    { 
        id: "s101", 
        name: 'DURAN DURAN - "Rio" Album', 
        createdBy: Users.u01, 
        tags: ["New Wave", "1980s", "Synthpop", "Pop Rock"],
        playlistId: 'PLlRF5jS3IgSl15vhFZLl-ZSsNS6ftdnKQ'
    },
    { 
        id: "s102", 
        name: "12-The Beatles - Abbey road (full album)", 
        createdBy: Users.u02, 
        tags: ["Classic", "Rock", "1960s", "British"], 
        playlistId: 'PLycVTiaj8OI-kwvNjgvvopMJt__x-y5mD'
    },
    { 
        id: "s103", 
        name: "Starset - Vessels [Full Album]", 
        createdBy: Users.u03, 
        tags: ["Electronic", "Ambient", "Experimental", "Modern", "2010s"], 
        playlistId: 'PLRPMu7rvR8Ldvkij69fXMvHD88rTloiJO'
    },
    { 
        id: "s104", 
        name: "Bruno Mars - Official Music Videos Playlist", 
        createdBy: Users.u04, 
        tags: ["Pop", "Hits", "Contemporary", "Dance", "2010s"], 
        playlistId: "PL2gNzJCL3m_8e21QH4D-Kz5KB7iC-Dk23"
    },
    { 
        id: "s105", 
        name: "New RTJ mix", 
        createdBy: Users.u05, 
        tags: ["HipHop", "Rap", "Modern", "Beats", "2010s"], 
        playlistId: "PLPCBn_vuxOabbF0C46_eUpffI9uCD_zar"
    },
    { 
        id: "s106", 
        name: "Kinect Star Wars: Galactic Dance Off", 
        createdBy: Users.u06, 
        tags: ["Game", "Dance", "Sci-Fi", "Electronic", "2010s"], 
        playlistId: "PLC80E87CFFE1D1F88"
    },
    { 
        id: "s107", 
        name: "Habitual Line Crosser", 
        createdBy: Users.u07, 
        tags: ["Indie", "Alternative", "Comedy", "Show", "2010s"], 
        playlistId: "PLyUFbJeIzikcpL7q-WifJNPJj9nSdj5h7"
    },
    { 
        id: "s108", 
        name: "Pure's Futurama Playlist", 
        createdBy: Users.u08, 
        tags: ["Animation", "Comedy", "Show", "Entertaining", "2000s"], 
        playlistId: "PLcQxGKD4J0yYoQoOMIKOQfJCd8xISOQu8"
    },
    { 
        id: "s109", 
        name: "Best Clips | House M.D.", 
        createdBy: Users.u09, 
        tags: ["Drama", "Medical", "Show", "Comedy", "2000s"], 
        playlistId: "PL2YdNHqIELAY__jIZsvK_se0LoSKBsTEP"
    },
    { 
        id: "s110", 
        name: "Mix - Jason Derulo, Usher & Chris Brown ♫ 💛", 
        createdBy: Users.u10, 
        tags: ["R&B", "Soul", "Pop", "Hits", "2010s"], 
        playlistId: "PLInwUcsJ3hI0rger4WAvBekTqPTCDG8aC"
    },
    { 
        id: "s111", 
        name: "rick and morty remix playlist :)", 
        createdBy: Users.u11, 
        tags: ["Animation", "Comedy", "Show", "Sci-Fi", "2010s"], 
        playlistId: "PLrXTnKWQt0YWvayIMTxmAOaQHxxqm9Y3L"
    },
    { 
        id: "s112", 
        name: "Backstreet Boys--Mix Songs", 
        createdBy: Users.u12, 
        tags: ["R&B", "Pop", "Boy Band", "1990s"], 
        playlistId: "PLAFB207129E572E62"
    },
    { 
        id: "s113", 
        name: "Janis Joplin Mix 1", 
        createdBy: Users.u13, 
        tags: ["Rock", "Blues", "1960s", "Iconic", "1960s"], 
        playlistId: 'PLB01FBE3D7C95CAEA' 
    },
    { 
        id: "s114", 
        name: "Louis Armstrong mix", 
        createdBy: Users.u14, 
        tags: ["Jazz", "Classic", "Trumpet", "Legendary", "1950s"], 
        playlistId: 'PL6A9BECDB1EE6578F' 
    },
    { 
        id: "s115", 
        name: "nina simone playlist", 
        createdBy: Users.u15, 
        tags: ["Soul", "R&B", "Jazz", "Powerful Voice", "1960s"], 
        playlistId: 'PLhtzR5XBHSgZPbzQGGycazNud5WSeXT5O' 
    },
    { 
        id: "s116", 
        name: "Ray Charles Mix", 
        createdBy: Users.u16, 
        tags: ["Blues", "R&B", "Soul", "Pioneering", "1950s"], 
        playlistId: 'PL4FB84C89F174A7A8' 
    },
    { 
        id: "s117", 
        name: "Jimi Hendrix playlist", 
        createdBy: Users.u17, 
        tags: ["Rock", "Psychedelic", "Guitar Hero", "Influential", "1960s"], 
        playlistId: 'PLftG57WWSs_Kkl4ja3Qbkpjm-5kk8eGmW' 
    },
    { 
        id: "s118", 
        name: "The Very Best of Ella Fitzgerald", 
        createdBy: Users.u18, 
        tags: ["Jazz", "Live", "Vocal Jazz", "Classic", "1950s"], 
        playlistId: 'PL64A034E9B0579F97' 
    },
    { 
        id: "s119", 
        name: "chuck berry mix", 
        createdBy: Users.u19, 
        tags: ["Rock'n'Roll", "Classic", "Guitar", "Pioneer", "1950s"], 
        playlistId: 'PLD43179A933832758' 
    },
    { 
        id: "s120", 
        name: "Etta James mix", 
        createdBy: Users.u20, 
        tags: ["Blues", "R&B", "Soul", "Empowering", "1960s"], 
        playlistId: 'PL8d1wWDCISzgqtvcoLBJaUKvvmaensDgo' 
    },
    { 
        id: "s121", 
        name: "Miles Davis - 100 Masterpieces", 
        createdBy: Users.u21, 
        tags: ["Jazz", "Trumpet", "Cool Jazz", "Innovative", "1950s"], 
        playlistId: 'PLccpwGk_xup8EbuaOc_hm0Uc6bOKbO8By'
    },
    { 
        id: "s122", 
        name: "Billie Holiday YouTube Mix", 
        createdBy: Users.u22, 
        tags: ["Blues", "Jazz", "Soul", "Iconic", "1940s"], 
        playlistId: 'PLEE91630C9FDC517C'
    },
    { 
        id: "s123", 
        name: "Charlie Parker Greatest Hits playlist", 
        createdBy: Users.u23, 
        tags: ["Jazz", "Bebop", "Saxophone", "Swing", "1940s"], 
        playlistId: 'PLcbZsrmlXdIDeanA21hYYg_e72T4MX1NW'
    },
    { 
        id: "s124", 
        name: "Dizzy Gillespie Mix", 
        createdBy: Users.u24, 
        tags: ["Bebop", "Jazz", "Trumpet", "Innovative", "1940s"], 
        playlistId: 'PL1A414BABE70A42D1'
    }
];
