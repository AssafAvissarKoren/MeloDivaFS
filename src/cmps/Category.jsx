import React from 'react';
import { StationPreview } from './StationPreview';
import { useNavigate } from 'react-router';

export const Status = {
  ROW: 'row',
  CUBE: 'cube',
  RESULTS: 'results',
};

export const Category = ({ stations, category_name, category_color = "black", category_image = null, style, setCurrentCategory }) => {
  const navigate = useNavigate();

  function handleOnClick(categoryName) {
    navigate(`/melodiva/genre/${categoryName}`, { replace: true });
    setCurrentCategory(category_name)
  } 

  const renderStations = () => {
    return stations.map(station => (
      <StationPreview 
        key={station._id} 
        station={station}
      />
    ));
  };

  if (style === "row") {
    return (
      <div className="category-row">
        <h2 onClick={() => handleOnClick(category_name)}>{category_name}</h2>
        <div className="row">{renderStations()}</div>
      </div>
    );

  } else if (style === "cube") {
    return (
      <div className="category-cube" style={{ backgroundColor: category_color }}>
        <h2 onClick={() => handleOnClick(category_name)}>{category_name}</h2>
        <img src={category_image} alt={category_name} className="cube-image" />
      </div>
    );

  } else if (style === "results") {
    return (
      <div className="category-results">
        <h2>{category_name}</h2>
        <div className="grid">{renderStations()}</div>
      </div>
    );
    
  } else {
    return null; // Or a default rendering
  }
};
