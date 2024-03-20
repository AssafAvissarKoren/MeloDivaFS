import axios from "axios"
import { utilService } from "./util.service"
import { queryService } from "./query.service"

export const dataService = {
    createStationData,
    createLikedTracksData,
    searchYoutube,
    getDurations,
    ajaxGetStationTracks,
    fetchChannelData,
    getDefaultStations,
    fetchVideoDurations,
    setVideoDurations,
}

const API_KEY = 'AIzaSyD5_pPOj9mwAPQz41a1ymh9AuhbZxS6ySQ' // 'AIzaSyC3YOy0NUIShjRXdNxhZazirA58eiMbQDI' // 
const STATION_API_URL = 'https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50'
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/channels';

async function getDefaultStations() {
    return defaultStations
}

async function createStationData(storageKey) {
    let stations = utilService.loadFromStorage(storageKey);

    if (!stations || !stations.length) {
        stations = [];
        
        for (const { id, name, description, artist, createdBy, tags, playlistId, mostCommonColor } of defaultStations) {
            console.log(name, playlistId)
            const newStation = await createStation(id, name, description, artist, createdBy, tags, playlistId, mostCommonColor);
            const newStationWithDurations = await dataService.setVideoDurations(newStation)
            stations.push(newStationWithDurations);
        }

        utilService.saveToStorage(storageKey, stations);
    }
}

async function createLikedTracksData(storageKey) {
    let stations = utilService.loadFromStorage(storageKey);
    if (!stations || !stations.length) utilService.saveToStorage(storageKey, [{_id: 'l101'}]);
}

async function createStation(stationId, name, description, artist, createdBy, tags, playlistId, mostCommonColor) {
    let tracks = await ajaxGetStationTracks(playlistId);
    tracks = tracks.map(track => createTrack(track, createdBy));


    let imgUrl = 'default_thumbnail_url';
    for (const track of tracks) {
        if (track.imgUrl !== 'default_thumbnail_url') {
            imgUrl = track.imgUrl;
            break;
        }
    }

    return {
        _id: stationId,
        name,
        description,
        artist,
        imgUrl,
        tags,
        createdBy,
        likedByUsers: [Users.u02, Users.u03],
        tracks,
        mostCommonColor,
        msgs: [
            {
                id: 'm101',
                from: createdBy,
                txt: utilService.makeLoremWords(5),
            }
        ]
    };
}

function createTrack(track, addedBy) {
    const snippet = track.snippet || {};
    const resourceId = snippet.resourceId || {};
    const thumbnails = snippet.thumbnails || {};
    const standard = thumbnails.standard || {};

    return {
        title: snippet.title || 'Unknown Title',
        artist: snippet.channelTitle || 'Unknown Artist',
        url: resourceId.videoId || 'Unknown Video ID',
        imgUrl: standard.url || 'default_thumbnail_url',
        addedBy: addedBy
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

async function fetchChannelData(videoOwnerChannelId) {
    try {
      const res = await axios.get(`${YOUTUBE_API_URL}?id=${videoOwnerChannelId}&part=snippet,contentDetails,statistics&key=${API_KEY}`);
      return res.data.items[0];
    } catch (err) {
        console.error(err)
        throw err
    }
  };


async function searchYoutube(query) {
    const foundQuery = await queryService.findQuery(query);
    if (foundQuery) {
      console.log("Query found in DB!")
      return foundQuery;
    }
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
        params: {
            part: 'snippet',
            maxResults: 5,
            q: query,
            key: API_KEY
        }
    });
    await queryService.saveQuery(query, response.data.items);
    return response.data.items;
}

async function getDurations(tracksIds) {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
        params: {
            part: 'contentDetails',
            id: tracksIds,
            key: API_KEY
        }
    });
    const durations = response.data.items.map(item => item.contentDetails.duration);
    // console.log("getDurations", durations)
    // console.log("getDurations", durations.map(duration => utilService.formatDuration(duration)))
    return durations;
}

async function fetchVideoDurations(station) {
  try {
      // Extract the video IDs from the track URLs
      const tracksIds = station.tracks.map(track => {
          // Assuming the URL contains the video ID at the end after '='
          const urlParts = track.url.split('=');
          return urlParts[urlParts.length - 1];
      }).join(',');
      return await getDurations(tracksIds)
  } catch (error) {
      console.error('Error fetching video durations', error);
      return []; // Return an empty array in case of an error
  }
};

async function setVideoDurations(station) {
  try {
      // Fetch video durations for the station's tracks
      const durations = await fetchVideoDurations(station);
      
      // Update each track with its corresponding duration
      const updatedTracks = station.tracks.map((track, index) => {
          return {
              ...track,
              duration: durations[index] // Assuming durations are in the same order as tracks
          };
      });

      // Return the station object with updated track durations
      return {
          ...station,
          tracks: updatedTracks
      };
  } catch (error) {
      console.error('Error setting video durations', error);
      return station; // Return the original station object in case of an error
  }
}


const Users = {
    u01: { _id: "u101", fullname: "John Smith", imgUrl: "http://some-photo/" },
    u02: { _id: "u102", fullname: "Mary Johnson", imgUrl: "http://some-photo/" },
    u03: { _id: "u103", fullname: "James Brown", imgUrl: "http://some-photo/" },
    u04: { _id: "u104", fullname: "Jennifer Miller", imgUrl: "http://some-photo/" },
    u05: { _id: "u105", fullname: "Michael Davis", imgUrl: "http://some-photo/" },
    u06: { _id: "u106", fullname: "Jessica Wilson", imgUrl: "http://some-photo/" },
    u07: { _id: "u107", fullname: "Christopher Moore", imgUrl: "http://some-photo/" },
    u08: { _id: "u108", fullname: "Sarah Taylor", imgUrl: "http://some-photo/" },
    u09: { _id: "u109", fullname: "David Anderson", imgUrl: "http://some-photo/" },
    u10: { _id: "u110", fullname: "Jessica Martinez", imgUrl: "http://some-photo/" },
    u11: { _id: "u111", fullname: "Robert Jackson", imgUrl: "http://some-photo/" },
    u12: { _id: "u112", fullname: "Michelle Harris", imgUrl: "http://some-photo/" },
    u13: { _id: "u113", fullname: "Richard Thompson", imgUrl: "http://some-photo/" },
    u14: { _id: "u114", fullname: "Laura Clark", imgUrl: "http://some-photo/" },
    u15: { _id: "u115", fullname: "Matthew Lewis", imgUrl: "http://some-photo/" },
    u16: { _id: "u116", fullname: "Karen King", imgUrl: "http://some-photo/" },
    u17: { _id: "u117", fullname: "Andrew Baker", imgUrl: "http://some-photo/" },
    u18: { _id: "u118", fullname: "Emily Parker", imgUrl: "http://some-photo/" },
    u19: { _id: "u119", fullname: "Justin Adams", imgUrl: "http://some-photo/" },
    u20: { _id: "u120", fullname: "Amanda Scott", imgUrl: "http://some-photo/" },
    u21: { _id: "u121", fullname: "Christopher Hill", imgUrl: "http://some-photo/" },
    u22: { _id: "u122", fullname: "Melissa Nelson", imgUrl: "http://some-photo/" },
    u23: { _id: "u123", fullname: "Joshua Carter", imgUrl: "http://some-photo/" },
    u24: { _id: "u124", fullname: "Elizabeth Mitchell", imgUrl: "http://some-photo/" },
    u25: { _id: "u125", fullname: "Daniel Perez", imgUrl: "http://some-photo/" },
    u26: { _id: "u126", fullname: "Ashley Gonzalez", imgUrl: "http://some-photo/" },
    u27: { _id: "u127", fullname: "Christopher Young", imgUrl: "http://some-photo/" },
    u28: { _id: "u128", fullname: "Stephanie Roberts", imgUrl: "http://some-photo/" },
    u29: { _id: "u129", fullname: "Joseph Lee", imgUrl: "http://some-photo/" },
    u30: { _id: "u130", fullname: "Jennifer Walker", imgUrl: "http://some-photo/" },
    u31: { _id: "u131", fullname: "David Hall", imgUrl: "http://some-photo/" },
    u32: { _id: "u132", fullname: "Kimberly Wright", imgUrl: "http://some-photo/" },
    u33: { _id: "u133", fullname: "James Adams", imgUrl: "http://some-photo/" },
    u34: { _id: "u134", fullname: "Michelle Green", imgUrl: "http://some-photo/" },
    u35: { _id: "u135", fullname: "John Torres", imgUrl: "http://some-photo/" },
    u36: { _id: "u136", fullname: "Emily Hall", imgUrl: "http://some-photo/" },
    u37: { _id: "u137", fullname: "Matthew Lopez", imgUrl: "http://some-photo/" },
    u38: { _id: "u138", fullname: "Laura Hill", imgUrl: "http://some-photo/" },
    u39: { _id: "u139", fullname: "Ryan Baker", imgUrl: "http://some-photo/" },
    u40: { _id: "u140", fullname: "Jessica Mitchell", imgUrl: "http://some-photo/" },
    u41: { _id: "u141", fullname: "Kevin Perez", imgUrl: "http://some-photo/" },
    u42: { _id: "u142", fullname: "Rebecca Rivera", imgUrl: "http://some-photo/" },
    u43: { _id: "u143", fullname: "Andrew Foster", imgUrl: "http://some-photo/" },
    u44: { _id: "u144", fullname: "Nicole Gonzalez", imgUrl: "http://some-photo/" },
    u45: { _id: "u145", fullname: "Brandon Scott", imgUrl: "http://some-photo/" },
    u46: { _id: "u146", fullname: "Samantha Roberts", imgUrl: "http://some-photo/" },
    u47: { _id: "u147", fullname: "Nicholas Turner", imgUrl: "http://some-photo/" },
    u48: { _id: "u148", fullname: "Danielle Young", imgUrl: "http://some-photo/" },
    u49: { _id: "u149", fullname: "Justin Nelson", imgUrl: "http://some-photo/" },
    u50: { _id: "u150", fullname: "Stephanie White", imgUrl: "http://some-photo/" }
};

export const defaultStations = [
    {
      id: "s165",
      name: "The Matrix Soundtrack",
      description: '',
      artist: "The Matrix",
      createdBy: Users.u15,
      tags: [
        "Soundtrack",
        "Electronic",
        "Rock",
        "1990s"
      ],
      playlistId: "PLqnnuEVGcRQyQhvsd5Tl47q9JllRqcnGY",
      mostCommonColor: "#39.f45d1745d17696.ae8ba2e8ba2c5.0ba2e8ba2e88"
    },
    {
      id: "s166",
      name: "Fight Club - Original Soundtrack by The Dust Brothers OST",
      description: '',
      artist: "The Dust Brothers",
      createdBy: Users.u16,
      tags: [
        "Soundtrack",
        "Instrumental",
        "Hip hop",
        "Electronic",
        "Rock",
        "1990s"
      ],
      playlistId: "PL-1kvMPmp96rnsrJgwZrEdYfI7N8liSh0",
      mostCommonColor: "#c4246c"
    },
    {
      id: "s167",
      name: "Pulp Fiction - Soundtrack (Collectors Edition)",
      description: '',
      artist: "Pulp Fiction",
      createdBy: Users.u17,
      tags: [
        "Soundtrack",
        "Rock",
        "Soul",
        "Pop",
        "R&B",
        "1990s"
      ],
      playlistId: "PLF4C445D6E234A0F6",
      mostCommonColor: "#efbc12"
    },
    {
      id: "s168",
      name: "Guardians of the Galaxy - Awesome Mix Vol. 1",
      description: '',
      artist: "Guardians of the Galaxy",
      createdBy: Users.u18,
      tags: [
        "Soundtrack",
        "Rock",
        "Pop",
        "Soul",
        "R&B",
        "1980s"
      ],
      playlistId: "PLpRjkOHBe_TgmznCle__jWDhoV4aFgCjw",
      mostCommonColor: "#db3c24"
    },
    {
      id: "s169",
      name: "Various – Trainspotting (Music From The Motion Picture)",
      description: '',
      artist: "Trainspotting",
      createdBy: Users.u19,
      tags: [
        "Soundtrack",
        "Rock",
        "Pop",
        "Electronic",
        "R&B",
        "Hip hop",
        "1990s"
      ],
      playlistId: "PLkdH33fATc7ugUi9E3Y7rXGNQlBp9E5RG",
      mostCommonColor: "#f07e4b"
    },
    {
      id: "s170",
      name: "The Complete Moulin Rouge Soundtrack",
      description: '',
      artist: "Moulin Rouge",
      createdBy: Users.u20,
      tags: [
        "Soundtrack",
        "Pop",
        "Rock",
        "R&B",
        "2000s"
      ],
      playlistId: "PLonxlFqJwO_V6GxEvh97zTOn07ghk8W8v",
      mostCommonColor: "#b66240"
    },
    {
      id: "s173",
      name: "Eminem - 8 Mile Soundtrack",
      description: '',
      artist: "Eminem",
      createdBy: Users.u23,
      tags: [
        "Soundtrack",
        "Rap",
        "Hip hop",
        "2000s"
      ],
      playlistId: "PLA4tTqXOw4M2EfXETr0aeLwWw7Vt59EXQ",
      mostCommonColor: "#f4c418"
    },
    {
      id: "s175",
      name: "O Brother, Where Art Thou (2000) Soundtrack",
      description: '',
      artist: "O Brother, Where Art Thou",
      createdBy: Users.u25,
      tags: [
        "Soundtrack",
        "Country",
        "Folk",
        "2000s"
      ],
      playlistId: "PLMsFR-IuG_7F0EspAuL9NvBtsruK14F4s",
      mostCommonColor: "#d49434"
    },
    {
      id: "s176",
      name: "Titanic: Music from the Motion Picture",
      description: '',
      artist: "Titanic",
      createdBy: Users.u26,
      tags: [
        "Soundtrack",
        "Pop",
        "1990s"
      ],
      playlistId: "PLguHrh5iudNVf8Bi5bCJ0VDotmgBVWxBS",
      mostCommonColor: "#c47854"
    },
    {
      id: "s189",
      name: "Method Man & Redman - How High - The Soundtrack - So High",
      description: '',
      artist: "Method Man & Redman",
      createdBy: Users.u39,
      tags: [
        "Rap",
        "Hip hop",
        "Soundtrack",
        "2000s"
      ],
      playlistId: "PL932B0C8C7EE98847",
      mostCommonColor: "#fad64c"
    },
    {
      id: "s101",
      name: "DURAN DURAN - \"Rio\" Album",
      description: '',
      artist: "Duran Duran",
      createdBy: Users.u01,
      tags: [
        "British",
        "Pop",
        "Rock",
        "1980s"
      ],
      playlistId: "PLlRF5jS3IgSl15vhFZLl-ZSsNS6ftdnKQ",
      mostCommonColor: "#d42464"
    },
    {
      id: "s102",
      name: "12-The Beatles - Abbey road (full album)",
      description: '',
      artist: "The Beatles",
      createdBy: Users.u02,
      tags: [
        "Rock",
        "British",
        "1960s"
      ],
      playlistId: "PLycVTiaj8OI-kwvNjgvvopMJt__x-y5mD",
      mostCommonColor: "#4a8bb0"
    },
    {
      id: "s113",
      name: "Janis Joplin Mix 1",
      description: '',
      artist: "Janis Joplin",
      createdBy: Users.u13,
      tags: [
        "American",
        "Rock",
        "Blues",
        "1960s",
        "1960s"
      ],
      playlistId: "PLB01FBE3D7C95CAEA",
      mostCommonColor: "#91ef15"
    },
    {
      id: "s117",
      name: "Jimi Hendrix playlist",
      description: '',
      artist: "Jimi Hendrix",
      createdBy: Users.u17,
      tags: [
        "American",
        "Rock",
        "Psychedelic",
        "Guitar Hero",
        "1960s"
      ],
      playlistId: "PLftG57WWSs_Kkl4ja3Qbkpjm-5kk8eGmW",
      mostCommonColor: "#763541"
    },
    {
      id: "s130",
      name: "Aerosmith- all songs",
      description: '',
      artist: "Aerosmith",
      createdBy: Users.u30,
      tags: [
        "American",
        "Blues",
        "Rock",
        "1970s"
      ],
      playlistId: "PLqeOvB-u67NAYU6i6EgcninTN53WilKkX",
      mostCommonColor: "#844634"
    },
    {
      id: "s131",
      name: "Kiss Playlist",
      description: '',
      artist: "Kiss",
      createdBy: Users.u31,
      tags: [
        "American",
        "Rock",
        "Metal",
        "1970s"
      ],
      playlistId: "PL71A9E09DEF0CE017",
      mostCommonColor: "#c47c44"
    },
    {
      id: "s132",
      name: "Guns N' Roses Playlist",
      description: '',
      artist: "Guns N' Roses",
      createdBy: Users.u32,
      tags: [
        "American",
        "Rock",
        "Metal",
        "1980s"
      ],
      playlistId: "PLA8ACC4996D23A2D1",
      mostCommonColor: "#396ab6"
    },
    {
      id: "s133",
      name: "Led Zeppelin Greatest Hits (Chronological Order)",
      description: '',
      artist: "Led Zeppelin",
      createdBy: Users.u33,
      tags: [
        "British",
        "Rock",
        "Psychedelic",
        "Metal",
        "1960s"
      ],
      playlistId: "PLp3o6lwxnqMkm9dUECwqVBQY0IN6n1wH_",
      mostCommonColor: "#e29945"
    },
    {
      id: "s134",
      name: "Very best of The Who",
      description: '',
      artist: "The Who",
      createdBy: Users.u34,
      tags: [
        "British",
        "Rock",
        "Alternative",
        "Indie",
        "1960s"
      ],
      playlistId: "PLQemZA2f_EChuTClgrhwfM3kgqV4jQavV",
      mostCommonColor: "#da242b"
    },
    {
      id: "s135",
      name: "The Rolling Stones",
      description: '',
      artist: "The Rolling Stones",
      createdBy: Users.u35,
      tags: [
        "British",
        "Rock",
        "Blues",
        "Psychedelic",
        "1960s"
      ],
      playlistId: "PLNav38spIZE4tpahnCBoXIp6xFZQYY9eV",
      mostCommonColor: "#f80404"
    },
    {
      id: "s136",
      name: "Queen & Freddie Mercury Best Songs (Official Videos)",
      description: '',
      artist: "Queen",
      createdBy: Users.u36,
      tags: [
        "British",
        "Rock",
        "1970s"
      ],
      playlistId: "PLZYzh1QhBgMark6rrridAXQbozFrlxc12",
      mostCommonColor: "#f00a0a"
    },
    {
      id: "s137",
      name: "ACDC ONLY Playlist",
      description: '',
      artist: "AC/DC",
      createdBy: Users.u37,
      tags: [
        "Australian",
        "Rock",
        "Blues",
        "Metal",
        "1970s"
      ],
      playlistId: "PLpZaq7kciiNIscD5bMLUIyesR_EHTSvxu",
      mostCommonColor: "#deae2f"
    },
    {
      id: "s138",
      name: "Pink Floyd greatest hits",
      description: '',
      artist: "Pink Floyd",
      createdBy: Users.u38,
      tags: [
        "British",
        "Psychedelic",
        "Rock",
        "Blues",
        "Progressive",
        "1970s"
      ],
      playlistId: "PL1tiBqitg38_Rsqb2qiTvm3hKX2Y2qUgg",
      mostCommonColor: "#e7b904"
    },
    {
      id: "s139",
      name: "Van Halen Ultimate Playlist",
      description: '',
      artist: "Van Halen",
      createdBy: Users.u39,
      tags: [
        "Rock",
        "Metal",
        "1980s"
      ],
      playlistId: "PLa3pNwcfPlygyg0gi8XUJgIh0OEFQY5hm",
      mostCommonColor: "#bc684c"
    },
    {
      id: "s140",
      name: "Best Metallica Playlist",
      description: '',
      artist: "Metallica",
      createdBy: Users.u40,
      tags: [
        "Dutch",
        "Metal",
        "Rock",
        "1980s"
      ],
      playlistId: "PLenUrOlreSp6EXV4PJWLEvLIdnacjn-2w",
      mostCommonColor: "#f67d14"
    },
    {
      id: "s141",
      name: "Complete Black Sabbath Playlist",
      description: '',
      artist: "Black Sabbath",
      createdBy: Users.u41,
      tags: [
        "British",
        "Metal",
        "Rock",
        "1970s"
      ],
      playlistId: "PL5gOt5XOe6KAcW95TB4VYJYW91skzi6J8",
      mostCommonColor: "#bd3f3b"
    },
    {
      id: "s142",
      name: "The Very Best Of The Doors",
      description: '',
      artist: "The Doors",
      createdBy: Users.u42,
      tags: [
        "American",
        "Psychedelic",
        "Jazz",
        "Blues",
        "R&B",
        "Rock",
        "1960s"
      ],
      playlistId: "PL7DlGI0vwP4S6tlQ-kMqrl6VCaN053_BN",
      mostCommonColor: "#c92919"
    },
    {
      id: "s143",
      name: "U2 Greatest Hits",
      description: '',
      artist: "U2",
      createdBy: Users.u43,
      tags: [
        "Irish",
        "Alternative",
        "Rock",
        "1980s"
      ],
      playlistId: "PLBii4mTslcne6J-4sGmL8-8O_vmrpcWYP",
      mostCommonColor: "#b19854"
    },
    {
      id: "s144",
      name: "Iron Maiden Best Songs",
      description: '',
      artist: "Iron Maiden",
      createdBy: Users.u44,
      tags: [
        "British",
        "Metal",
        "Rock",
        "1980s"
      ],
      playlistId: "PLgF5KLwzxU-2blxEvK9IGZMZ6tKyPOg4L",
      mostCommonColor: "#da3130"
    },
    {
      id: "s145",
      name: "Rage Against the Machine | Best Songs",
      description: '',
      artist: "Rage Against the Machine",
      createdBy: Users.u45,
      tags: [
        "American",
        "Rap",
        "Rock",
        "Metal",
        "1990s"
      ],
      playlistId: "PLgsEX5K5yzJIrT_gIxWUD9amAwTq27G83",
      mostCommonColor: "#efba3e"
    },
    {
      id: "s146",
      name: "nirvana playlist",
      description: '',
      artist: "Nirvana",
      createdBy: Users.u46,
      tags: [
        "American",
        "Grunge",
        "Rock",
        "Alternative",
        "Psychedelic",
        "1990s"
      ],
      playlistId: "PLF1D793B61571DD4A",
      mostCommonColor: "#ec8033"
    },
    {
      id: "s147",
      name: "Pearl Jam Greatest Hits",
      description: '',
      artist: "Pearl Jam",
      createdBy: Users.u47,
      tags: [
        "American",
        "Rock",
        "Alternative",
        "1990s"
      ],
      playlistId: "PL-xTct5_jYAUBcHGajsk1CZe1Us0hpbKd",
      mostCommonColor: "#fc296c"
    },
    {
      id: "s148",
      name: "Best of Radiohead Studio",
      description: '',
      artist: "Radiohead",
      createdBy: Users.u48,
      tags: [
        "British",
        "Alternative",
        "Rock",
        "Electronic",
        "1990s"
      ],
      playlistId: "PLSI5yZ0wyxWmUheiXNt7opJeITbdTxXZR",
      mostCommonColor: "#dc8232"
    },
    {
      id: "s149",
      name: "oasis playlist",
      description: '',
      artist: "Oasis",
      createdBy: Users.u49,
      tags: [
        "British",
        "Rock",
        "British",
        "1990s"
      ],
      playlistId: "PL385F1D8C18DE2659",
      mostCommonColor: "#7f.800000000008d4.7ffffffffff82a.800000000006"
    },
    {
      id: "s150",
      name: "MAROON 5 - Top Tracks 🔥🔥 2022 Playlist",
      description: '',
      artist: "Maroon 5",
      createdBy: Users.u50,
      tags: [
        "American",
        "Pop",
        "Rock",
        "Dance",
        "2000s"
      ],
      playlistId: "PL6JkHhL5iZwVfOpktrGw2OpZGS-3y74Pc",
      mostCommonColor: "#84accc"
    },
    {
      id: "s151",
      name: "Coldplay - Greatest Hits",
      description: '',
      artist: "Coldplay",
      createdBy: Users.u01,
      tags: [
        "British",
        "Alternative",
        "Pop",
        "Rock",
        "2000s"
      ],
      playlistId: "PLWifY4ZVngjfsRWcaplbD2m1muE3b5Wn-",
      mostCommonColor: "#1a4c9c"
    },
    {
      id: "s163",
      name: "Robbie Williams playlist - BEST songs",
      description: '',
      artist: "Robbie Williams",
      createdBy: Users.u13,
      tags: [
        "British",
        "Pop",
        "Rock",
        "Dance",
        "British",
        "2000s"
      ],
      playlistId: "PLMEZyDHJojxNTVO7dQTqHtXOXLjRTVXsL",
      mostCommonColor: "#b6d04d"
    },
    {
      id: "s164",
      name: "Phil Collins.greatest hits.",
      description: '',
      artist: "Phil Collins",
      createdBy: Users.u14,
      tags: [
        "British",
        "Pop",
        "Progressive",
        "Rock",
        "Jazz",
        "Soul",
        "1960s"
      ],
      playlistId: "PLJ5cGDOKPw72LWDHjlfcwjnAiKvxOSa-C",
      mostCommonColor: "#e5.84c.819.7ffffffffffe"
    },
    {
      id: "s178",
      name: "The Very Best of Cream",
      description: '',
      artist: "Cream",
      createdBy: Users.u28,
      tags: [
        "British",
        "Rock",
        "Blues",
        "Psychedelic",
        "1960s"
      ],
      playlistId: "PLzZB0CyxUNPwAnHEhIGks6rNokkGnNXTU",
      mostCommonColor: "#20b6d0"
    },
    {
      id: "s179",
      name: "The Best of The Velvet Underground",
      description: '',
      artist: "The Velvet Underground",
      createdBy: Users.u29,
      tags: [
        "American",
        "Psychedelic",
        "Rock",
        "1960s"
      ],
      playlistId: "PLUm_5Qy9GaTwDf2lfzIfh3vd_wmACRw2K",
      mostCommonColor: "#79.3ac10c9714f87d.68eb04325c4885.c53ef368eb08"
    },
    {
      id: "s180",
      name: "13th Floor Elevators - Audio Playlist",
      description: '',
      artist: "13th Floor Elevators",
      createdBy: Users.u30,
      tags: [
        "American",
        "Psychedelic",
        "Rock",
        "1960s"
      ],
      playlistId: "PLl7vwYWvNN2OHhypvvOIxZRywTvNpmM1K",
      mostCommonColor: "#e9c31d"
    },
    {
      id: "s185",
      name: "David Bowie - 75 Official Playlist",
      description: '',
      artist: "David Bowie",
      createdBy: Users.u35,
      tags: [
        "British",
        "Rock",
        "Glam",
        "1970s"
      ],
      playlistId: "PLkRzqIoq7yc3A5-7E6bDlk5PLeJMNfZIi",
      mostCommonColor: "#ae.93b13b13b13881.7627627627650.6c4ec4ec4ec4"
    },
    {
      id: "s186",
      name: "Bruce Springsteen Playlist",
      description: '',
      artist: "Bruce Springsteen",
      createdBy: Users.u36,
      tags: [
        "American",
        "Rock",
        "Folk",
        "1970s"
      ],
      playlistId: "PL482FB403BD192535",
      mostCommonColor: "#bf.43f.c3f.c"
    },
    {
      id: "s187",
      name: "Fleetwood Mac Playlist",
      description: '',
      artist: "Fleetwood Mac",
      createdBy: Users.u37,
      tags: [
        "British",
        "Pop",
        "Rock",
        "1970s"
      ],
      playlistId: "PLCC4CD5FD7684F0A3",
      mostCommonColor: "#bf.3ffffffffff8bf.43f.c"
    },
    {
      id: "s103",
      name: "Starset - Vessels [Full Album]",
      description: '',
      artist: "Starset",
      createdBy: Users.u03,
      tags: [
        "American",
        "Electronic",
        "Ambient",
        "Experimental",
        "Modern",
        "2010s"
      ],
      playlistId: "PLRPMu7rvR8Ldvkij69fXMvHD88rTloiJO",
      mostCommonColor: "#3d7c88"
    },
    {
      id: "s106",
      name: "Kinect Star Wars: Galactic Dance Off",
      description: '',
      artist: "Kinect Star Wars",
      createdBy: Users.u06,
      tags: [
        "American",
        "Sountrack",
        "Game",
        "Dance",
        "Sci-Fi",
        "Electronic",
        "2010s"
      ],
      playlistId: "PLC80E87CFFE1D1F88",
      mostCommonColor: "#1470cc"
    },
    {
      id: "s152",
      name: "LADY GAGA ALL SONGS",
      description: '',
      artist: "Lady Gaga",
      createdBy: Users.u02,
      tags: [
        "American",
        "Pop",
        "Electronic",
        "Dance",
        "2000s"
      ],
      playlistId: "PL8e8V80lN3YLwSPoOFYNh_bCz1RuGqo0Y",
      mostCommonColor: "#246484"
    },
    {
      id: "s154",
      name: "Katy Perry - Greatest Hits, Grandes Exitos, Best Songs, Sus Mejores Canciones, Roar, Dark Horse, Bon Appetit, Firework, Hot N Cold, Last Friday Night",
      description: '',
      artist: "Katy Perry",
      createdBy: Users.u04,
      tags: [
        "American",
        "Pop",
        "Electronic",
        "Dance",
        "2000s"
      ],
      playlistId: "PLgaFNC_I_ZklfdCyeOGz2v79Hjm7jcPkz",
      mostCommonColor: "#cc2e61"
    },
    {
      id: "s156",
      name: "Madonna Songs - Madonna Greatest Hits Playlist",
      description: '',
      artist: "Madonna",
      createdBy: Users.u06,
      tags: [
        "American",
        "Pop",
        "Electronic",
        "Dance",
        "1980s"
      ],
      playlistId: "PLp_G0HWfCo5pjdCeRhtu8puTqddSbn1I5",
      mostCommonColor: "#7f.87f.87f.8"
    },
    {
      id: "s160",
      name: "P!NK 2022 - 2023 Playlist - (PINK) Top Tracks - New Songs - Hits - Official Videos - All Songs",
      description: '',
      artist: "P!NK",
      createdBy: Users.u10,
      tags: [
        "American",
        "Pop",
        "Electronic",
        "Dance",
        "2000s"
      ],
      playlistId: "PLq3UZa7STrbpX13PljcNH6hmyrSbcMYK8",
      mostCommonColor: "#9c1e31"
    },
    {
      id: "s190",
      name: "Billie Eilish - All Songs",
      description: '',
      artist: "Billie Eilish",
      createdBy: Users.u40,
      tags: [
        "American",
        "Pop",
        "Electronic",
        "Dance",
        "2010s"
      ],
      playlistId: "PLiyHrD1Lz34xUsqSUE2lyNRf-d_wbbqcz",
      mostCommonColor: "#be2f31"
    },
    {
      id: "s191",
      name: "Lorde's Greatest Hits",
      description: '',
      artist: "Lorde",
      createdBy: Users.u41,
      tags: [
        "New Zealand",
        "Pop",
        "Electronic",
        "Dance",
        "2010s"
      ],
      playlistId: "PLyWnZmpNoZv10voGHildNfQRufeTW5SNX",
      mostCommonColor: "#bf.48c.43f.c"
    },
    {
      id: "s192",
      name: "All Songs Halsey",
      description: '',
      artist: "Halsey",
      createdBy: Users.u42,
      tags: [
        "American",
        "Pop",
        "Electronic",
        "Dance",
        "2010s"
      ],
      playlistId: "PL--wBSa9-XimwMDVyqvZrDt_-s9klwTcQ",
      mostCommonColor: "#34bcac"
    },
    {
      id: "s116",
      name: "Ray Charles Mix",
      description: '',
      artist: "Ray Charles",
      createdBy: Users.u16,
      tags: [
        "American",
        "Blues",
        "R&B",
        "Soul",
        "1950s"
      ],
      playlistId: "PL4FB84C89F174A7A8",
      mostCommonColor: "#4454ec"
    },
    {
      id: "s120",
      name: "Etta James mix",
      description: '',
      artist: "Etta James",
      createdBy: Users.u20,
      tags: [
        "American",
        "Blues",
        "R&B",
        "Soul",
        "1960s"
      ],
      playlistId: "PL8d1wWDCISzgqtvcoLBJaUKvvmaensDgo",
      mostCommonColor: "#efc83e"
    },
    {
      id: "s122",
      name: "Billie Holiday Playlist",
      description: '',
      artist: "Billie Holiday",
      createdBy: Users.u22,
      tags: [
        "American",
        "Blues",
        "Jazz",
        "Soul",
        "1940s"
      ],
      playlistId: "PLcHvqlzuc5ufaBkFWqjtMFQC2Po8U71_s",
      mostCommonColor: "#3f.cbf.48f.7"
    },
    {
      id: "s114",
      name: "Louis Armstrong mix",
      description: '',
      artist: "Louis Armstrong",
      createdBy: Users.u14,
      tags: [
        "American",
        "Jazz",
        "Classic",
        "Trumpet",
        "1950s"
      ],
      playlistId: "PL6A9BECDB1EE6578F",
      mostCommonColor: "#e7973f"
    },
    {
      id: "s115",
      name: "nina simone playlist",
      description: '',
      artist: "Nina Simone",
      createdBy: Users.u15,
      tags: [
        "American",
        "Soul",
        "R&B",
        "Jazz",
        "1960s"
      ],
      playlistId: "PLhtzR5XBHSgZPbzQGGycazNud5WSeXT5O",
      mostCommonColor: "#39.f45d1745d176c5.0ba2e8ba2e887f.800000000008"
    },
    {
      id: "s118",
      name: "The Very Best of Ella Fitzgerald",
      description: '',
      artist: "Ella Fitzgerald",
      createdBy: Users.u18,
      tags: [
        "American",
        "Jazz",
        "1950s"
      ],
      playlistId: "PL64A034E9B0579F97",
      mostCommonColor: "#ac2424"
    },
    {
      id: "s121",
      name: "Miles Davis - 100 Masterpieces",
      description: '',
      artist: "Miles Davis",
      createdBy: Users.u21,
      tags: [
        "American",
        "Jazz",
        "Trumpet",
        "1950s"
      ],
      playlistId: "PLccpwGk_xup8EbuaOc_hm0Uc6bOKbO8By",
      mostCommonColor: "#e34424"
    },
    {
      id: "s123",
      name: "Charlie Parker Greatest Hits playlist",
      description: '',
      artist: "Charlie Parker",
      createdBy: Users.u23,
      tags: [
        "American",
        "Jazz",
        "Bebop",
        "Saxophone",
        "Swing",
        "1940s"
      ],
      playlistId: "PLcbZsrmlXdIDeanA21hYYg_e72T4MX1NW",
      mostCommonColor: "#a46c44"
    },
    {
      id: "s124",
      name: "Dizzy Gillespie Playlist",
      description: '',
      artist: "Dizzy Gillespie",
      createdBy: Users.u24,
      tags: [
        "American",
        "Bebop",
        "Jazz",
        "Trumpet",
        "1940s"
      ],
      playlistId: "PLcEmEB9Nzqm1JgoXGoM6dxn3ip35bK_2s",
      mostCommonColor: "#b47454"
    },
    {
      id: "s125",
      name: "The best of Louis Armstrong",
      description: '',
      artist: "Louis Armstrong",
      createdBy: Users.u25,
      tags: [
        "American",
        "Jazz",
        "Classic",
        "Trumpet",
        "1950s"
      ],
      playlistId: "PL6DC9F41EBC5695D1",
      mostCommonColor: "#e7973f"
    },
    {
      id: "s126",
      name: "Ornette Coleman - Of Human Feelings",
      description: '',
      artist: "Ornette Coleman",
      createdBy: Users.u26,
      tags: [
        "American",
        "Jazz",
        "Saxophone ",
        "1940s"
      ],
      playlistId: "PLMynaxX_I0z9UI9HU_oJxv3Ge_YFPc8IC",
      mostCommonColor: "#c6ac59"
    },
    {
      id: "s127",
      name: "Miles Davis Playlist - The Best Playlist Ever",
      description: '',
      artist: "Miles Davis",
      createdBy: Users.u27,
      tags: [
        "American",
        "Alternative",
        "Indie",
        "Jazz",
        "Trumpet",
        "1940s"
      ],
      playlistId: "PL-4U2d6ASRHllzHHsZOlP0-9NwbAx44bQ",
      mostCommonColor: "#2c8ce4"
    },
    {
      id: "s128",
      name: "DUKE ELLINGTON PLAYLIST...CLASSIC",
      description: '',
      artist: "Duke Ellington",
      createdBy: Users.u28,
      tags: [
        "American",
        "Big-Band",
        "Jazz",
        "Piano",
        "1910s"
      ],
      playlistId: "PLB471B642193A253B",
      mostCommonColor: "#e874a4"
    },
    {
      id: "s129",
      name: "Charles Mingus Playlist",
      description: '',
      artist: "Charles Mingus",
      createdBy: Users.u29,
      tags: [
        "American",
        "Bebop",
        "Jazz",
        "Bass",
        "1940s"
      ],
      playlistId: "PL0a-3E47mvaZb3wTbF4tZ5PpnX8hVUHo1",
      mostCommonColor: "#de2524"
    },
    {
      id: "s104",
      name: "Bruno Mars - Official Music Videos Playlist",
      description: '',
      artist: "Bruno Mars",
      createdBy: Users.u04,
      tags: [
        "American",
        "Pop",
        "Hits",
        "Contemporary",
        "Dance",
        "2010s"
      ],
      playlistId: "PL2gNzJCL3m_8e21QH4D-Kz5KB7iC-Dk23",
      mostCommonColor: "#cc4f2c"
    },
    {
      id: "s110",
      name: "Mix - Jason Derulo, Usher & Chris Brown ♫ 💛",
      description: '',
      artist: "Jason Derulo, Usher & Chris Brown",
      createdBy: Users.u10,
      tags: [
        "American",
        "R&B",
        "Soul",
        "Pop",
        "Hits",
        "2010s"
      ],
      playlistId: "PLInwUcsJ3hI0rger4WAvBekTqPTCDG8aC",
      mostCommonColor: "#ba6a24"
    },
    {
      id: "s112",
      name: "Backstreet Boys--Mix Songs",
      description: '',
      artist: "Backstreet Boys",
      createdBy: Users.u12,
      tags: [
        "American",
        "R&B",
        "Pop",
        "Boy Band",
        "1990s"
      ],
      playlistId: "PLAFB207129E572E62",
      mostCommonColor: "#54accc"
    },
    {
      id: "s153",
      name: "All of Beyoncé's Music Videos",
      description: '',
      artist: "Beyoncé",
      createdBy: Users.u03,
      tags: [
        "American",
        "R&B",
        "Pop",
        "Soul",
        "Dance",
        "2000s"
      ],
      playlistId: "PLEPP8FBvYRtpu3oDrrZe-W_DVmvExr267",
      mostCommonColor: "#c1643e"
    },
    {
      id: "s155",
      name: "Britney Spears All Songs",
      description: '',
      artist: "Britney Spears",
      createdBy: Users.u05,
      tags: [
        "American",
        "Pop",
        "Dance",
        "2000s"
      ],
      playlistId: "PLx0WqN8Bw331afcQT2hBoy1ncdmgs08Th",
      mostCommonColor: "#b51f19"
    },
    {
      id: "s157",
      name: "Christina Aguilera - Music Videos",
      description: '',
      artist: "Christina Aguilera",
      createdBy: Users.u07,
      tags: [
        "American",
        "Pop",
        "R&B",
        "Dance",
        "2000s"
      ],
      playlistId: "PLEH_MKt4utKlKiD0EhmQKRLVLuG0mEF_b",
      mostCommonColor: "#e68221"
    },
    {
      id: "s158",
      name: "Kylie Minogue | The Ultimate Greatest Hits 1987 - 2021",
      description: '',
      artist: "Kylie Minogue",
      createdBy: Users.u08,
      tags: [
        "Australian",
        "Pop",
        "Dance",
        "1980s"
      ],
      playlistId: "PLrOnal_0u2Zo7zyPIEzrznqF7H08dgPed",
      mostCommonColor: "#7e663c"
    },
    {
      id: "s159",
      name: "Justin Timberlake - Mirrors / Music Playlist",
      description: '',
      artist: "Justin Timberlake",
      createdBy: Users.u09,
      tags: [
        "American",
        "Pop",
        "R&B",
        "Dance",
        "2000s"
      ],
      playlistId: "PLOhV0FrFphUctPyD0Y2xDFYR3fr4baqNi",
      mostCommonColor: "#b9.c924924924945.36db6db6db748.db6db6db6dc"
    },
    {
      id: "s161",
      name: "JENNIFER LOPEZ Greatest Hits",
      description: '',
      artist: "Jennifer Lopez",
      createdBy: Users.u11,
      tags: [
        "American",
        "Pop",
        "Latin",
        "Dance",
        "2000s"
      ],
      playlistId: "PLuveNUf1W08xrDH-VCgiFjHcAo_0i--i-",
      mostCommonColor: "#b46c4c"
    },
    {
      id: "s162",
      name: "Gwen Stefani Playlist",
      description: '',
      artist: "Gwen Stefani",
      createdBy: Users.u12,
      tags: [
        "Pop",
        "Reggae",
        "Dance",
        "2000s"
      ],
      playlistId: "PLFC24F1E12C4BB0EF",
      mostCommonColor: "#a84552"
    },
    {
      id: "s107",
      name: "Habitual Line Crosser",
      description: '',
      artist: "Habitual Line Crosser",
      createdBy: Users.u07,
      tags: [
        "American",
        "Indie",
        "Alternative",
        "Comedy",
        "Show",
        "2010s"
      ],
      playlistId: "PLyUFbJeIzikcpL7q-WifJNPJj9nSdj5h7",
      mostCommonColor: "#447c9c"
    },
    {
      id: "s108",
      name: "Pure's Futurama Playlist",
      description: '',
      artist: "Futurama",
      createdBy: Users.u08,
      tags: [
        "American",
        "Animation",
        "Comedy",
        "Show",
        "Entertaining",
        "2000s"
      ],
      playlistId: "PLcQxGKD4J0yYoQoOMIKOQfJCd8xISOQu8",
      mostCommonColor: "#fcc34c"
    },
    {
      id: "s109",
      name: "Best Clips | House M.D.",
      description: '',
      artist: "House M.D.",
      createdBy: Users.u09,
      tags: [
        "American",
        "Drama",
        "Medical",
        "Show",
        "Comedy",
        "2000s"
      ],
      playlistId: "PL2YdNHqIELAY__jIZsvK_se0LoSKBsTEP",
      mostCommonColor: "#e41615"
    },
    {
      id: "s111",
      name: "rick and morty remix playlist :)",
      description: '',
      artist: "Rick and Morty",
      createdBy: Users.u11,
      tags: [
        "American",
        "Animation",
        "Comedy",
        "Show",
        "Sci-Fi",
        "2010s"
      ],
      playlistId: "PLrXTnKWQt0YWvayIMTxmAOaQHxxqm9Y3L",
      mostCommonColor: "#06adc5"
    },
    {
      id: "s171",
      name: "Best Of Al Bundy | Married With Children",
      description: '',
      artist: "Married With Children",
      createdBy: Users.u21,
      tags: [
        "Comedy",
        "Show",
        "1990s"
      ],
      playlistId: "PL9kQbVDWDYC3xH-1GqZP1T-eSQ1W44F5I",
      mostCommonColor: "#ca751f"
    },
    {
      id: "s172",
      name: "The Big Bang Theory Playlist",
      description: '',
      artist: "The Big Bang Theory",
      createdBy: Users.u22,
      tags: [
        "Comedy",
        "Show",
        "2000s"
      ],
      playlistId: "PLXWxAAcCuOUQwQPb5vOYVgSI936P5GhgT",
      mostCommonColor: "#dc9e2d"
    },
    {
      id: "s181",
      name: "GEORGE CARLIN & FULL ROUTINE",
      description: '',
      artist: "George Carlin",
      createdBy: Users.u31,
      tags: [
        "American",
        "Comedy",
        "Stand-up",
        "Show",
        "1970s"
      ],
      playlistId: "PL5ht1gvdFkmRhz90r-ELOFVldlCg9BCAz",
      mostCommonColor: "#c49480"
    },
    {
      id: "s182",
      name: "Stand up- Chris Rock",
      description: '',
      artist: "Chris Rock",
      createdBy: Users.u32,
      tags: [
        "American",
        "Comedy",
        "Stand-up",
        "Show",
        "1990s"
      ],
      playlistId: "PLPoKt6XQMtLNSxKXu30GT67pb6YjSDztF",
      mostCommonColor: "#425fa6"
    },
    {
      id: "s183",
      name: "Bill Burr Playlist",
      description: '',
      artist: "Bill Burr",
      createdBy: Users.u33,
      tags: [
        "American",
        "Comedy",
        "Stand-up",
        "Show",
        "2000s"
      ],
      playlistId: "PLqfAPIXRRD6t7t0v-XarOJ2fAtL3SuZFa",
      mostCommonColor: "#ac6c3c"
    },
    {
      id: "s184",
      name: "Jim Norton Stand Up",
      description: '',
      artist: "Jim Norton",
      createdBy: Users.u34,
      tags: [
        "American",
        "Comedy",
        "Stand-up",
        "Show",
        "2000s"
      ],
      playlistId: "PLLDawp_60VjsH6r6VW2MGBYOqYLhGQG_Q",
      mostCommonColor: "#f6e609"
    },
    {
      id: "s188",
      name: "Bob Marley's Greatest Hits",
      description: '',
      artist: "Bob Marley",
      createdBy: Users.u38,
      tags: [
        "Jamaican",
        "Reggae",
        "Ska",
        "1970s"
      ],
      playlistId: "PL1uvTe4OACGrBS_A06_-fK7dvVIX3Jq4F",
      mostCommonColor: "#f8f506"
    },
    {
      id: "s105",
      name: "New RTJ mix",
      description: '',
      artist: "Run The Jewels",
      createdBy: Users.u05,
      tags: [
        "American",
        "Hip hop",
        "Rap",
        "Modern",
        "Beats",
        "2010s"
      ],
      playlistId: "PLPCBn_vuxOabbF0C46_eUpffI9uCD_zar",
      mostCommonColor: "#c99a3e"
    },
    {
      id: "s119",
      name: "chuck berry mix",
      description: '',
      artist: "Chuck Berry",
      createdBy: Users.u19,
      tags: [
        "American",
        "Rock'n'Roll",
        "Guitar",
        "1950s"
      ],
      playlistId: "PLD43179A933832758",
      mostCommonColor: "#c51f16"
    }
  ]