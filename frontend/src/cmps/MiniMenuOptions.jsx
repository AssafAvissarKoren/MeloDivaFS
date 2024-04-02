import React, { useState } from 'react';
import { utilService } from "../services/util.service"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faMinus, faTrash, faCircleCheck, faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons'
import { svgSvc } from "../services/svg.service"
import { getStationsByUser, getStationsInLibrary } from "../store/actions/station.actions"
import { ImgUploader } from "./ImgUploader"

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

// {stationByUser && miniMenuOptions.editStation({
//     imgUrl: getImage(),
//     name: station.name,
//     description: station.description,
//     submit: onEditDetails,
//     onClose: onCloseMiniMenu
// })
// }

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

// function editStation({ imgUrl: initialImgUrl, name, description, submit, onClose }) {
//     const [imgUrl, setImgUrl] = useState(initialImgUrl);

//     function handleImgUploaded(newImgUrl) {
//         setImgUrl(newImgUrl);
//     }

//     function handleSubmit(ev) {
//         ev.preventDefault();
//         const dataObject = {
//             name: ev.target.name.value,
//             description: ev.target.description.value,
//             imgUrl: imgUrl // Include the imgUrl state in the form data
//         };
//         submit(dataObject);
//     }


//     function handleKeyDown(ev) {
//         if (ev.key === 'Enter') {
//             ev.preventDefault();
//         }
//     }

//     return (
//         <form className="edit-station" onSubmit={handleSubmit}>
//             <div className="head">
//                 <h2>Edit details</h2>
//                 <button onClick={onClose}>
//                     <svgSvc.miniMenu.Ex/>
//                 </button>
//             </div>
//             <div className="body">
//                 <button className="btn-img-container">
//                     <img src={imgUrl} alt="Station" />
//                 </button>
//                 <ImgUploader onUploaded={handleImgUploaded} />
//                 <input className="input input-name" 
//                     type="text" 
//                     name="name"
//                     placeholder="Add a name"
//                     defaultValue={name}
//                     maxLength="100"
//                     onKeyDown={handleKeyDown}
//                     autoComplete="off"
//                 />
//                 <textarea className="input input-description" 
//                     name="description"
//                     placeholder="Add an optional description"
//                     defaultValue={description}
//                     maxLength="300"
//                     onKeyDown={handleKeyDown}
//                     autoComplete="off"
//                 />
//                 <div className="save-container">
//                     <input type="submit" className="btn-save" value="Save" />
//                 </div>
//                 <p className="info">
//                     By proceeding, you agree to give Melodiva access to the image you choose to upload. Please make sure you have the right to upload the image.
//                 </p>
//             </div>

//         </form>
//     )
// }