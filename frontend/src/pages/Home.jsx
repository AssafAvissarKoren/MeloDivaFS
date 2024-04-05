import { useState, useEffect } from 'react';
import { categoryService } from '../services/category.service';
import { CategoryDisplay } from '../cmps/CategoryDisplay';
import { useSelector } from 'react-redux';
import { StationPreview } from '../cmps/StationPreview';

export function Home({ }) {
    const categories = useSelector(storeState => storeState.categoryModule.categories)
    const stations = useSelector(storeState => storeState.stationModule.stations)
    
    // COMPONENTS
    function HeadStations({stationNum, isSkeleton}) {
        return (
            <div className='head-stations'>
                {isSkeleton ?
                    Array.from({ length: stationNum }, (_, i) => (
                        <StationPreview 
                        key={`home-head ${i}`} 
                        station={null} 
                        type={"home-head"}
                        />
                    ))
                :
                    stations.slice(0, stationNum).map((station) =>
                        <StationPreview key={`home-head ${station._id}`} station={station} type={"home-head"} />
                    )
                }
            </div>
        )
    }
    
    function Categories({isSkeleton}) {
        if(isSkeleton) {
            return (
                <div className='category-display'>
                    {Array.from({ length: 10 }, (_, i) => (
                        <CategoryDisplay 
                        key={`category-display ${i}`} 
                        category={null} 
                        style={categoryService.Status.ROW}
                        />
                    ))}
                </div>
            )
        } else {
            return (
                <div className='category-display'>
                    {categories.map(category => (
                        <CategoryDisplay 
                            key={category._id}
                            category={category}
                            style={categoryService.Status.ROW}
                        />
                    ))}
                </div>
            )
        }
    }

    return (
        <section className="home">
            <HeadStations stationNum={6} isSkeleton={!stations}/>
            <Categories isSkeleton={!categories}/>
        </section>
    )
}
