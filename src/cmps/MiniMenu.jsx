import { useEffect, useRef } from "react"



export function MiniMenu({children, onCloseMiniMenu}) {
    const modalRef = useRef()

    useEffect(() => {
        setTimeout(() => {
            document.addEventListener('click', handleClickOutside)
        }, 0)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    },[])

    function handleClickOutside(ev) {
        if (modalRef.current && !modalRef.current.contains(ev.target)) {
            onCloseMiniMenu()
        }
    }

    return (
        <div ref={modalRef} className="mini-menu">
            {children}
        </div>
    )
}

