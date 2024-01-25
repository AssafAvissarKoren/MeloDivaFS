import { useState, useEffect } from 'react';
import { stationService } from '../services/station.service';
import { categoryService } from '../services/category.service';
import imgUrl from '../assets/imgs/react.png';
import { Category, Status } from '../cmps/Category';
import { useSelector } from 'react-redux';

export function Home({ setCurrentCategory }) {
    const [categories, setCategories] = useState([]);
    const stations = useSelector(storeState => storeState.stationModule.stations)

    useEffect(() => {
        const fetchCategories = async () => {
            const fetchedCategories = await categoryService.getCategories();
            setCategories(fetchedCategories);
        };

        fetchCategories();
    }, []);

    const getStationsForCategory = (categoryIds) => {
        return stations.filter(station => categoryIds.includes(station._id));
    };

    if (!stations || !categories.length) return <div>Loading...</div>;
    
    return (
        <section className="home">
            <div className='category-display'>
                {categories.map(category => (
                    <Category 
                        key={category.categoryName}
                        stations={getStationsForCategory(category.stationsIds)}
                        category_name={category.categoryName}
                        category_color={"brown"}
                        category_image={imgUrl}
                        style={Status.ROW}
                        setCurrentCategory={setCurrentCategory}
                    />
                ))}
            </div>
        </section>
    );
}
