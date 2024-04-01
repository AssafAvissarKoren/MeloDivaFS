import { useEffect, useState } from "react";

export const useResizer = (MIN_NAV_WIDTH, MIN_MAIN_WIDTH, MINI_NAV_WIDTH) => {
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 616);
    const [isResizing, setIsResizing] = useState(false);
    const [sideNavWidth, setSideNavWidth] = useState(startCollapsed() ? MINI_NAV_WIDTH : MIN_NAV_WIDTH)
    const [collapsedWidth, setCollapsedWidth] = useState(startCollapsed() ? MIN_NAV_WIDTH : 0) // hold width before width became MINI_NAV_WIDTH

    useEffect(() => {
        window.addEventListener('resize', handleWindowChangeWidth)
        return () => {
            window.removeEventListener('resize', handleWindowChangeWidth)
          }
    },[])

    useEffect(() => {
        if(isResizing) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
        } else {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    
        return () => {
          document.removeEventListener('mousemove', handleMouseMove)
          document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isResizing])

    function startCollapsed() {
        return window.innerWidth - 24 < MIN_NAV_WIDTH + MIN_MAIN_WIDTH
    }

    function handleWindowChangeWidth() {
        setIsSmallScreen(window.innerWidth <= 616)
        setSideNavWidth( (prevSideNavWidth) => {
            const windowWidth = window.innerWidth - 24 // for padding
            let newNavWidth = prevSideNavWidth

            if( windowWidth < prevSideNavWidth + MIN_MAIN_WIDTH ) {
                newNavWidth = windowWidth - MIN_MAIN_WIDTH
                if(newNavWidth <= MIN_NAV_WIDTH) {
                    newNavWidth = MINI_NAV_WIDTH
                    setCollapsedWidth(MIN_NAV_WIDTH)
                }
            } 

            return newNavWidth
        })
    }

    function startResize(ev) {
        ev.preventDefault()
        setIsResizing(true)
    }

    function handleMouseMove(ev){
        const windowWidth = window.innerWidth - 24 // for padding
        if (isResizing && windowWidth > MIN_NAV_WIDTH + MIN_MAIN_WIDTH) {
            let newNavWidth
            if(ev.clientX > windowWidth - MIN_MAIN_WIDTH) newNavWidth = windowWidth - MIN_MAIN_WIDTH
            else if(ev.clientX < MINI_NAV_WIDTH + MIN_NAV_WIDTH/2) newNavWidth = MINI_NAV_WIDTH
            else if(ev.clientX < MIN_NAV_WIDTH) newNavWidth = MIN_NAV_WIDTH
            else newNavWidth = ev.clientX

            setCollapsedWidth(newNavWidth == MINI_NAV_WIDTH ? MIN_NAV_WIDTH : 0)
            setSideNavWidth(newNavWidth)
        }
    }

    function handleMouseUp(){
        setIsResizing(false)
    }

    function toggleMini() {
        if(!collapsedWidth) {
            setCollapsedWidth(sideNavWidth)
            setSideNavWidth(MINI_NAV_WIDTH)
            return
        }

        const windowWidth = window.innerWidth - 24 // for padding
        if(windowWidth >= collapsedWidth + MIN_MAIN_WIDTH) {
            setCollapsedWidth(0)
            setSideNavWidth(collapsedWidth)
        }
    }

    return [isSmallScreen, sideNavWidth, isResizing, startResize, toggleMini]
}