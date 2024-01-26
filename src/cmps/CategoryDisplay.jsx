import React, { useEffect, useState, useContext } from 'react';
import { StationPreview } from './StationPreview';
import { useNavigate } from 'react-router';
import { getStations } from "../store/actions/station.actions"
import { IndexContext } from '../cmps/IndexContext.jsx';

export const CategoryDisplay = ({ category, style, setCurrentCategory }) => {
  const { setFilterBy } = useContext(IndexContext);

  if (!category) { return <div>Loading...</div>; }

  const navigate = useNavigate();
  const [categoryStations, setCategoryStations] = useState([]);

  useEffect(() => {
      const fetchCategory = async () => {
          if (category) {
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
            <img src={category.image} alt={category.name} className="cube-image" />
          </div>
        );
      case "results":
        return (
          <div className="category-results">
            <h2>{category.name}</h2>
            <div className="grid">{renderStations(categoryStations)}</div>
          </div>
        );
      default:
        return null; // Or a default rendering
    }
  };

  const renderStations = (renderedStations) => {
    if (renderedStations && renderedStations.length > 0) {
      return renderedStations.map((station) => (
        <StationPreview 
          key={station._id} 
          station={station} 
        />
      ));
    } else {
      return <p>No stations available.</p>; // Handle the case when there are no stations
    }
  };
  
  if (category) {
    return renderCategory();
  } else {
    return null; // Handle the case where category is undefined
  }  
};
