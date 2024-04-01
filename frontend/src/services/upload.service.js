export const uploadService = {
    uploadImg
}

async function uploadImg(ev) {
    const CLOUD_NAME = "dbwxscqid"
    const UPLOAD_PRESET = "g1ijphbe"
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

    try {
        const formData = new FormData()
        formData.append('upload_preset', UPLOAD_PRESET)
        formData.append('file', ev.target.files[0])

        const res = await fetch(UPLOAD_URL, {
            method: 'POST',
            body: formData
        })
        const imgData = await res.json()

        return imgData
    } catch (err) {
        console.error('Failed to upload', err)
        throw err
    }
}