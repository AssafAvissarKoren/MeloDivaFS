import { useSelector } from "react-redux"
import { StationPreview } from "../cmps/StationPreview"
import { getLikedTracksAsStation } from "../store/actions/user.actions"


export function Library() {
    const stations = useSelector(storeState => storeState.stationModule.stations)
    const likedTracks = useSelector(storeState => storeState.userModule.likedTracks)
    const userId = useSelector(storeState => storeState.userModule.userId)

    function getStationsInLibrary() {
        return stations.filter(station => {
            return station.likedByUsers.filter(likedByUser => likedByUser._id === userId).length
        })
    }

    return (
        <div className="library">
            <ul>
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
