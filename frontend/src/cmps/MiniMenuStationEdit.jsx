import { useState } from "react"
import { svgSvc } from "../services/svg.service"
import { ImgUploader } from "./ImgUploader"
import { imageService } from "../services/image.service"

export function MiniMenuStationEdit({ imgUrl, name, description, isPublic = false, submit, onClose }) {
    const [fields, setFields] = useState({ imgUrl, name, description, isPublic, mostCommonColor: "#333333"})

    function handleImgUploaded(newImgUrl) {
        setFields(prevFields => ({...prevFields, imgUrl: newImgUrl}));
    }

    function handleChange({ target }) {
        let { name: field, value, type } = target
        switch (type) {
            case 'number':
            case 'range':
                value = (+value || '')
                break
            case 'checkbox':
                value = target.checked
            default:
                break
        }
        setFields((prevFields) => ({ ...prevFields, [field]: value }))
    }

    async function onSubmit(ev) {
        ev.preventDefault();
        const mostCommonColor = await imageService.analyzeCommonColor(fields.imgUrl);
        submit({ ...fields, mostCommonColor });
    }
    
    function handleKeyDown(ev) {
        if (ev.key === 'Enter') {
            ev.preventDefault()
        }
    }

    return (
        <form className="edit-station" onSubmit={onSubmit}>
            <div className="head">
                <h2>Edit details</h2>
                <button onClick={onClose}>
                    <svgSvc.miniMenu.Ex/>
                </button>
            </div>
            <div className="body">
                <button className="btn-img-container">
                    <img src={fields.imgUrl} />
                </button>
                <ImgUploader onUploaded={handleImgUploaded} />
                <input className="input input-name" 
                    type="text" 
                    name="name"
                    placeholder="Add a name"
                    defaultValue={fields.name}
                    maxLength="100"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                />
                <textarea className="input input-description" 
                    name="description"
                    placeholder="Add an optional description"
                    defaultValue={fields.description}
                    maxLength="300"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                />
                <div className={`public-private-container ${fields.isPublic ? 'public' : 'private'}`}>
                    {fields.isPublic ? <p>Make private</p> : <p>Make public</p>}
                    <label className="public-private-toggle">
                        <input type="checkbox" 
                        name="isPublic"
                        defaultChecked={fields.isPublic} 
                        onChange={handleChange}/>
                        <div className="circle"/>
                    </label>
                </div>
                <div className="save-container">
                    <input type="submit" className="btn-save" value="Save" onClick={onSubmit}/>
                </div>
                <p className="info">
                    By proceeding, you agree to give Melodiva access to the image you choose to upload. Please make sure you have the right to upload the image.
                </p>
            </div>

        </form>
    )
}