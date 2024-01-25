import { useState, useEffect } from 'react';
import { stationService } from '../services/station.service';
import { categoryService } from '../services/category.service';
import imgUrl from '../assets/imgs/react.png';
import { CategoryDisplay } from '../cmps/CategoryDisplay';

export function Home({ stations, setCurrentCategory }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const fetchedCategories = await categoryService.getCategories();
            setCategories(fetchedCategories);
        };

        fetchCategories();
    }, []);

    if (!stations || !categories.length) return <div>Loading...</div>;
    
    return (
        <section className="home">
            <div className='category-display'>
                {categories.map(category => (
                    <CategoryDisplay 
                        key={category._id}
                        category={category}
                        style={categoryService.Status.ROW}
                        setCurrentCategory={setCurrentCategory}
                    />
                ))}
            </div>
        </section>
    );
}
