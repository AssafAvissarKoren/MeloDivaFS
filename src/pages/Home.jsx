import { useState, useEffect } from 'react';
import { stationService } from '../services/station.service';
import { categoryService } from '../services/category.service';
import imgUrl from '../assets/imgs/react.png';
import { Category, Status } from '../cmps/Category';

export function Home({ stations, setCurrentCategory }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const fetchedCategories = await categoryService.getCategories();
            setCategories(fetchedCategories);
        };

        fetchCategories();
    }, []);

    const getStationsForCategory = (categoryIds) => {
        // console.log("1", categoryIds)
        // console.log("2", stations)
        const temp = stations.filter(station => categoryIds.includes(station._id));
        // console.log("3", temp)
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
