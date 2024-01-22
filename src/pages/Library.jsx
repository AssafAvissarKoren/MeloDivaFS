import imgUrl from '../assets/imgs/react.png'

export function Library({ stations }) {
    return (
        <div className="library">
            <h1 style={{color: "white"}}>Welcome to the Library Page</h1>
            <img src={imgUrl} alt="" />
        </div>
    )
}
