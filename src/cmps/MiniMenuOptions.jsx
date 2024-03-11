import { utilService } from "../services/util.service"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faMinus, faTrash, faCircleCheck, faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons'


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

function hr() {
    return (
        <hr className="hr"/>
    )
}
function addToLibrary(func) {
    return (
        <button className="btn" onClick={func}>
            <div className="circle">
                <img
                    className="svg"
                    src={utilService.getImgUrl("../assets/imgs/plus.svg")}
                />
            </div>
            <p>Add to your library</p>
        </button> 
    )
}
function removeFromLibrary(func) {
    return (
        <button className="btn" onClick={func}>
            <FontAwesomeIcon icon={faCircleCheck} className="icon green"/>
            <p>Remove from your library</p>
        </button>
    )
}
function addToQueue(func) {
    return (
        <button className="btn" onClick={func}>
            <img
                className="svg"
                src={utilService.getImgUrl("../assets/imgs/queue.svg")}
            />
            <p>Add to queue</p>
        </button> 
    )
}
function share(func) {
    return (
        <button className="btn" onClick={func}>
            <FontAwesomeIcon icon={faArrowUpFromBracket} className="icon"/>
            <p>Share</p>
        </button> 
    )
}
function addToPlaylist(func) {
    return (
        <button className="btn" onClick={func}>
            <img
                className="svg"
                src={utilService.getImgUrl("../assets/imgs/plus.svg")}
            />
            <p>Add to your Playlist</p>
        </button> 
    )
}
function removeFromPlaylist(func) {
    return (
        <button className="btn" onClick={func}>
            <FontAwesomeIcon icon={faTrash} className="icon"/>
            <p>Remove from this Playlist</p>
        </button>
    )
}
function addToLikedSongs(func) {
    return (
        <button className="btn" onClick={func}>
            <div className="circle">
                <img
                    className="svg"
                    src={utilService.getImgUrl("../assets/imgs/plus.svg")}
                />
            </div>
            <p>Save to your Liked Songs</p>
        </button> 
    )
}
function removeFromLikedSongs(func) {
    return (
        <button className="btn" onClick={func}>
            <FontAwesomeIcon icon={faCircleCheck} className="icon green"/>
            <p>Remove from your Liked Songs</p>
        </button>
    )
}
function deleteObj(func) {
    return (
        <button className="btn" onClick={func}>
            <div className="circle">
                <FontAwesomeIcon icon={faMinus} className="icon"/>
            </div>
            <p>Delete</p>
        </button>
    )
}
function editDetails(func) {
    return (
        <button className="btn" onClick={func}>
            <FontAwesomeIcon icon={faPen} className="icon"/>
            <p>Edit details</p>
        </button>
    )
}

function editStation(imgUrl, name, description, onSubmit, onClose ) {
    return (
        <form className="edit-station" onSubmit={onSubmit}>
            <div className="head">
                <h2>Edit details</h2>
                <button onClick={onClose}>
                    <img
                        className="svg"
                        src={utilService.getImgUrl("../assets/imgs/ex.svg")}
                    />
                </button>
            </div>
            <div className="body">
                <button className="btn-img-container">
                    <img src={imgUrl} />
                </button>
                <input className="input input-name" 
                    type="text" 
                    placeholder="Add a name"
                />
                <textarea className="input input-description" 
                    placeholder="Add an optional description"
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