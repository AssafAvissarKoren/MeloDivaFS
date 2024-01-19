import React from 'react';
import { StationPreview } from './StationPreview'; // Assuming StationPreview is already defined

const Category = ({ stations, category_name, category_color, category_image, style }) => {
  const renderStations = () => {
    return stations.map(station => (
      <StationPreview key={station._id} station={station} />
    ));
  };

  if (style === "row") {
    return (
      <div className="category-row">
        <h2>{category_name}</h2>
        <div className="row">{renderStations()}</div>
      </div>
    );
  } else if (style === "cube") {
    return (
      <div className="category-cube" style={{ backgroundColor: category_color }}>
        <span>{category_name}</span>
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

export default Category;
