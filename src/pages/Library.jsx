import { useSelector } from "react-redux"
import { StationPreview } from "../cmps/StationPreview"
import { getBasicUser, getLikedTracksAsStation } from "../store/actions/user.actions"
import { stationService } from "../services/station.service"
import { saveStation } from "../store/actions/station.actions"
import { utilService } from "../services/util.service"
import { IndexContext } from '../cmps/IndexContext.jsx'
import { useContext } from "react"


export function Library() {
    const { setFilterBy } = useContext(IndexContext)
    const stations = useSelector(storeState => storeState.stationModule.stations)
    const likedTracks = useSelector(storeState => storeState.userModule.likedTracks)

    function getStationsInLibrary() {
        return stations.filter(station => {
            return (
                station.createdBy._id === getBasicUser()._id ||
                station.likedByUsers.filter(likedByUser => likedByUser._id === getBasicUser()._id).length !== 0
            )
        })
    }

    async function createNewStation() {
        const name = 'New Playlist'
        const imgUrl = utilService.getImgUrl('../assets/imgs/MeloDiva.png')
        let newStation = stationService.createStation(name, getBasicUser(), imgUrl)
        newStation = await saveStation(newStation)

        const newFilterBy = {
            tab: 'station',
            stationId: newStation._id,
            text: '',
          };
      
        setFilterBy(newFilterBy);
    }

    return (
        <div className="library">
            <div className="title">
                <button onClick={createNewStation}>
                    Create Playlist +
                </button>
            </div>
            <ul className="content">
                <li>
                <StationPreview station={getLikedTracksAsStation()} />
                </li>
                {getStationsInLibrary().map(station => {
                    return <li key={`library${station._id}`}>
                        <StationPreview station={station} />
                    </li>
                })}
            </ul>
        </div>
    )
}
