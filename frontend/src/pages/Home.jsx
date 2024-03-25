import { useState, useEffect } from 'react';
import { categoryService } from '../services/category.service';
import { CategoryDisplay } from '../cmps/CategoryDisplay';
import { useSelector } from 'react-redux';

export function Home({ }) {
    const [categories, setCategories] = useState([]);
    const stations = useSelector(storeState => storeState.stationModule.stations)

    useEffect(() => {
        const fetchCategories = async () => {
            const fetchedCategories = await categoryService.getCategories();
            setCategories(fetchedCategories);
        };

        fetchCategories();
    }, []);
    

    if (!stations || !categories.length) {
        return <div></div>; //Loading...
    } else {
            return (
            <section className="home">
                <div className='category-display'>
                    {categories.map(category => (
                        <CategoryDisplay 
                            key={category._id}
                            category={category}
                            style={categoryService.Status.ROW}
                        />
                    ))}
                </div>
            </section>
        );
    }
}
