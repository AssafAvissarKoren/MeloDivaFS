import { utilService } from "../services/util.service"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faMinus, faTrash, faCircleCheck, faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons'
import { svgSvc } from "../services/svg.service"
import { getStationsByUser, getStationsInLibrary } from "../store/actions/station.actions"

export const miniMenuOptions = {
    hr,
    addToLibrary,
    removeFromLibrary,
    addToQueue,
    share,
    addToPlaylist,
    removeFromPlaylist,
    addToLikedSongs,
    removeFromLikedSongs,
    deleteObj,
    editDetails,
}

// Add to playlist 
// Remove from your Liked Songs 
// Add to queue 
// Go to song radio 
// Go to artist 
// Go to album 
// Show credits 
// Share 
// Open in Desktop app 


function hr() {
    return (
        <hr className="hr"/>
    )
}   

function addToLibrary(func) {
    return (
        <button className="btn" onClick={func}>
            <svgSvc.miniMenu.AddToLiked/>
            <p>Add to your library</p>
        </button> 
    )
}

function removeFromLibrary(func) {
    return (
        <button className="btn" onClick={func}>
            <svgSvc.miniMenu.RemoveFromLiked/>
            <p>Remove from your library</p>
        </button>
    )
}

function addToQueue(func) {
    return (
        <button className="btn" onClick={func}>
            <svgSvc.miniMenu.AddToQueue />
            <p>Add to queue</p>
        </button> 
    )
}

function share(func) {
    return (
        <button className="btn" onClick={func}>
            <svgSvc.miniMenu.Share/>
            <p>Share</p>
        </button> 
    )
}

function addToPlaylist(func) {
    return (
        <div className="extended-mini-menu-container">
            <button className="btn">
                < svgSvc.miniMenu.AddToPlaylist />
                <p>Add to your Playlist</p>
            </button> 
            <div className="extended-mini-menu">
                {getStationsByUser().map(station => {
                    return <button 
                        key={`minimap${station._id}`} 
                        className="btn" 
                        onClick={() => func(station._id)}
                        >
                        {station.name}
                    </button>
                })}
            </div>
        </div>
    )
}

function removeFromPlaylist(func) {
    return (
        <button className="btn" onClick={func}>
            <svgSvc.miniMenu.RemoveFromPlaylist/>
            <p>Remove from this Playlist</p>
        </button>
    )
}

function addToLikedSongs(func) {
    return (
        <button className="btn" onClick={func}>
                < svgSvc.miniMenu.AddToLiked />
            <p>Save to your Liked Songs</p>
        </button> 
    )
}

function removeFromLikedSongs(func) {
    return (
        <button className="btn" onClick={func}>
            < svgSvc.miniMenu.RemoveFromLiked />
            <p>Remove from your Liked Songs</p>
        </button>
    )
}

function deleteObj(func) {
    return (
        <button className="btn" onClick={func}>
            <div className="circle">
                {/* < svgSvc.miniMenu.RemoveFromYourLikedSongs /> */}
                <FontAwesomeIcon icon={faMinus} className="icon"/>
            </div>
            <p>Delete</p>
        </button>
    )
}

function editDetails(func) {
    return (
        <button className="btn" onClick={func}>
            {/* < svgSvc.miniMenu. no idea what the icon is /> */}
            <FontAwesomeIcon icon={faPen} className="icon"/>
            <p>Edit details</p>
        </button>
    )
}