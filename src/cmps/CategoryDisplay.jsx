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
            <h2 onClick={() => handleOnClick(category)}>{category.name}</h2>
            <div className="row">{renderStations(categoryStations)}</div>
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
    let stationsToRender = renderedStations;
  
    if (stationsToRender && stationsToRender.length > 0) {
      return stationsToRender.map((station) => (
        <StationPreview 
          key={station._id} 
          station={station} 
        />
      ));
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
