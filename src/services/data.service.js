import axios from "axios"
import { trackService } from "./track.service"
import { utilService } from "./util.service"

const API_KEY = 'AIzaSyD5_pPOj9mwAPQz41a1ymh9AuhbZxS6ySQ'
const STATION_API_URL = 'https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50'


async function ajaxGetStationTracks(stationId) {
    try {
        const res = await axios.get(`${STATION_API_URL}&playlistId=${stationId}&key=${API_KEY}`)
        return res.data.items
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function createStationData(storageKey) {
    let stations = utilService.loadFromStorage(storageKey)

    if (!stations || !stations.length) { //!stations || !stations.length
        stations = []
        let tracks

        tracks = await ajaxGetStationTracks('PLlRF5jS3IgSl15vhFZLl-ZSsNS6ftdnKQ')
        tracks = tracks.map(track => trackService.createTrack(track))
        stations.push({
            _id: "s101",
            name: "Rio",
            imgUrl: tracks ? tracks[0].imgUrl : 'blank',
            tags: [
                "Funk",
                "Happy"
            ],
            createdBy: {
                _id: "u101",
                fullname: "Duran Duran",
                imgUrl: "http://some-photo/"
            },
            likedByUsers: [
                {
                    _id: "u102",
                    fullname: "Bob Ross",
                    imgUrl: "http://some-photo/"
                },
                {
                    _id: "u103",
                    fullname: "Mike Tyson",
                    imgUrl: "http://some-photo/"
                }
            ],
            tracks: tracks ? tracks : [],
            msgs: [
                {
                    id: 'm101',
                    from: {
                        _id: "u104",
                        fullname: "John Lenon",
                        imgUrl: "http://some-photo/"
                    },
                    txt: 'Manish?'
                }
            ]
        })

        tracks = await ajaxGetStationTracks('PLycVTiaj8OI-kwvNjgvvopMJt__x-y5mD')
        tracks = tracks.map(track => trackService.createTrack(track))
        stations.push({
            _id: "s102",
            name: "Abbey Road",
            imgUrl: tracks ? tracks[0].imgUrl : 'blank',
            tags: [
                "Funk",
                "Happy"
            ],
            createdBy: {
                _id: "u102",
                fullname: "beatles",
                imgUrl: "http://some-photo/"
            },
            likedByUsers: [
                {
                    _id: "u102",
                    fullname: "Bob Ross",
                    imgUrl: "http://some-photo/"
                },
                {
                    _id: "u103",
                    fullname: "Mike Tyson",
                    imgUrl: "http://some-photo/"
                }
            ],
            tracks: tracks ? tracks : [],
            msgs: [
                {
                    id: 'm101',
                    from: {
                        _id: "u104",
                        fullname: "John Lenon",
                        imgUrl: "http://some-photo/"
                    },
                    txt: 'Manish?'
                }
            ]
        })

        tracks = await ajaxGetStationTracks('PLRPMu7rvR8Ldvkij69fXMvHD88rTloiJO')
        tracks = tracks.map(track => trackService.createTrack(track))
        stations.push({
            _id: "s103",
            name: "Vessels",
            imgUrl: tracks ? tracks[0].imgUrl : 'blank',
            tags: [
                "Funk",
                "Happy"
            ],
            createdBy: {
                _id: "u102",
                fullname: "Starset",
                imgUrl: "http://some-photo/"
            },
            likedByUsers: [
                {
                    _id: "u102",
                    fullname: "Bob Ross",
                    imgUrl: "http://some-photo/"
                },
                {
                    _id: "u103",
                    fullname: "Mike Tyson",
                    imgUrl: "http://some-photo/"
                }
            ],
            tracks: tracks ? tracks : [],
            msgs: [
                {
                    id: 'm101',
                    from: {
                        _id: "u104",
                        fullname: "John Lenon",
                        imgUrl: "http://some-photo/"
                    },
                    txt: 'Manish?'
                }
            ]
        })

        utilService.saveToStorage(storageKey, stations)
    }
}