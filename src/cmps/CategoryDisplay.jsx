import React, { useEffect, useState, useContext, useRef } from 'react';

import { StationPreview } from './StationPreview';
import { IndexContext } from './IndexContext.jsx';

import { getStations } from '../store/actions/station.actions';

export const CategoryDisplay = ({ category, style, setCurrentCategory }) => {
  const { setFilterBy } = useContext(IndexContext);
  const [categoryStations, setCategoryStations] = useState([]);

  if (!category) { return <div>Loading...</div>; }

  useEffect(() => {
      const fetchCategory = async () => {
        if (category && category.stationIds) {
            const stations = await getStations();
            const filteredStations = stations.filter(station => category.stationIds.includes(station._id));
            setCategoryStations(filteredStations);
          }
      };

      fetchCategory();
  }, [category]);

  function handleOnClick(category) {
    const newFilterBy = {
      tab: 'genre',
      stationId: category._id,
      text: '',
    };
    setFilterBy(newFilterBy);
    setCurrentCategory(category)
  }

  const renderCategory = () => {
    switch (style) {
      case "row":
        return (
          <div className="category-row">
            <div className="title">
              <h2 onClick={() => handleOnClick(category)}>{category.name} {/*categoryStations.length*/}</h2>
              <p onClick={() => handleOnClick(category)}>Show all</p>
            </div>
            <div className="row">{renderStations(categoryStations, true)}</div>
          </div>
        );
      case "cube":
        return (
          <div className="category-cube" style={{ backgroundColor: category.color }}>
            <h2 onClick={() => handleOnClick(category)}>{category.name}</h2>
            <div className="cube-image-container">
              <img src={category.image} alt={category.name} className="cube-image" />
            </div>
          </div>
        );
      case "results":
        return (
          <div className="category-results">
            <h2>{category.name}</h2>
            <div className="grid">{renderStations(categoryStations)}</div>
          </div>
        );
      case "test":
        return (
          <div className="category-test">
            <h2>{category.name}</h2>
            <div className="grid">{renderStations(null)}</div>
          </div>
        );
      default:
        return null;
    }
  };
 
  const renderStations = (renderedStations) => { 
    // console.log('catName', category.name, 'catLen', renderedStations.length, 'catStart', category.startingPosition);
  
    if (renderedStations && renderedStations.length > 0) {
      const startingPosition = category.startingPosition % renderedStations.length;

      return renderedStations.map((station, index) => {
        const mappedIndex = (index + startingPosition) % renderedStations.length;
        // console.log('mappedIndex', mappedIndex, "index", index, "startingPosition", startingPosition);
        return (
          <StationPreview 
            key={renderedStations[mappedIndex]._id} 
            station={renderedStations[mappedIndex]} 
          />
        );
      });
    } else {
      // Mock StationPreview with null station (for skeleton screen)
      return Array.from({ length: 10 }, (_, i) => (
        <StationPreview 
          key={i} 
          station={null} 
        />
      ));
    }
  };
  
  
  
  
    
  if (category) {
    return renderCategory();
  } else {
    return null;
  }  
};
