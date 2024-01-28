import { useSelector } from "react-redux"
import { StationPreview } from "../cmps/StationPreview"


export function Library() {
    const stations = useSelector(storeState => storeState.stationModule.stations)
    const likedTracks = useSelector(storeState => storeState.userModule.likedTracks)

    // function getStationsInLibrary() {
    //     return stations.filter(station =>
    //         station.likedByUsers.filter(likedByUser => 
    //             likedByUser._id === storeState.userModule._id))
    // }

    function getStationsInLibrary() {
        return stations.filter(station =>
            console.log(station.likedByUsers))
    }

    console.log(getStationsInLibrary().length)
    return (
        <div className="library">
            <ul>
                {getStationsInLibrary().map(station => {
                    return <li key={`library${station._id}`}>
                        <StationPreview station={station} />
                    </li>
                })}
            </ul>
        </div>
    )
}
