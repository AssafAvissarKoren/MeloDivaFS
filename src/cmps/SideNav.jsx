import { useParams } from 'react-router-dom';

export const SideNav = () => {
    const params = useParams();
    const tab = params.tab

    const tabData = ["Home", "Search", "Your Library"];

    async function handleFolderSelect() {
        
    }
    console.log(tabData)
    return (
        <div className="side-nav">
            {Object.entries(tabData).map(([key, tabItem]) => {
                return (
                    <div
                        key={key}
                        onClick={() => handleFolderSelect(tabItem)}
                        className={tabItem === tab ? 'active' : ''}
                    >
                    {tabItem}
                    </div>
                );
            })}
        </div>
    );
};
