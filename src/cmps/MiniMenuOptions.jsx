import { utilService } from "../services/util.service"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faMinus, faTrash, faCircleCheck, faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons'
import { svgSvc } from "../services/svg.service"

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
    editStation,
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
        <button className="btn" onClick={func}>
            < svgSvc.miniMenu.AddToPlaylist />
            <p>Add to your Playlist</p>
        </button> 
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

function editStation(imgUrl, name, description, submit, onClose ) {

    function handleSubmit(ev) {
        ev.preventDefault()
        const data = new FormData(ev.target)
        const dataObject = {}

        for (const [name, value] of data.entries()) {
          dataObject[name] = value
        }
        
        submit(dataObject)
    }

      function handleKeyDown(ev) {
        if (ev.key === 'Enter') {
          ev.preventDefault();
        }
      }

    return (
        <form className="edit-station" onSubmit={handleSubmit}>
            <div className="head">
                <h2>Edit details</h2>
                <button onClick={onClose}>
                    <svgSvc.miniMenu.Ex/>
                </button>
            </div>
            <div className="body">
                <button className="btn-img-container">
                    <img src={imgUrl} />
                </button>
                <input className="input input-name" 
                    type="text" 
                    name="name"
                    placeholder="Add a name"
                    defaultValue={name}
                    maxlength="100"
                    onKeyDown={handleKeyDown}
                    autocomplete="off"
                />
                <textarea className="input input-description" 
                    name="description"
                    placeholder="Add an optional description"
                    defaultValue={description}
                    maxlength="300"
                    onKeyDown={handleKeyDown}
                    autocomplete="off"
                />
                <div className="save-container">
                    <input type="submit" className="btn-save" value="Save" />
                </div>
                <p className="info">
                    By proceeding, you agree to give Melodiva access to the image you choose to upload. Please make sure you have the right to upload the image.
                </p>
            </div>

        </form>
    )
}