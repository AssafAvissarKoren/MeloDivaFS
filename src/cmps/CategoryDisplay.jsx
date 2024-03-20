import React, { useEffect, useState, useContext, useRef } from 'react';
import { StationPreview } from './StationPreview';
import { IndexContext } from './IndexContext.jsx';
import { getStations } from '../store/actions/station.actions';
import { useParams } from 'react-router';
import { categoryService} from '../services/category.service';
import { stationService } from '../services/station.service.js';

export const CategoryDisplay = ({ category, style }) => {
  const { collectionId } = useParams();
  const { setFilterBy, setCurrentCategory } = useContext(IndexContext);
  const [categoryStations, setCategoryStations] = useState([]);
  const [ currCategory, setCurrCategory ] = useState(null);
  const currStyle = useRef(style);

  useEffect(() => {
      fetchCategory(category);
  }, [category]);

  useEffect(() => {
    loadCategory();
  }, []);

  async function fetchCategory(category) {
    if (category && category.stationIds) {
        const stations = await getStations();
        const filteredStations = stations.filter(station => category.stationIds.includes(station._id));
        setCategoryStations(filteredStations);
      }
  };

  async function loadCategory() {
    if (category) {
      setCurrCategory(category);
      fetchCategory(category)
    } else {
      const currCat = await categoryService.getCategory(collectionId);
      setCurrCategory(currCat)
      fetchCategory(currCat)
    }
  }

  function handleOnClick(category) {
    const newFilterBy = {
      tab: 'genre',
      collectionId: category._id,
      text: '',
    };

    setFilterBy(prevFilterBy => ({...stationService.filterByUpdateHistory(prevFilterBy, newFilterBy)}))
    setCurrentCategory(category)
  }

  const renderCategory = () => {
    switch (currStyle.current) {
      case "row":
        return (
          <div className="category-row">
            <div className="title">
              <h2 onClick={() => handleOnClick(currCategory)}>{currCategory.name} </h2>
              <p onClick={() => handleOnClick(currCategory)}>Show all</p>
            </div>
            <div className="row">{renderStations(categoryStations)}</div>
          </div>
        );
      case "cube":
        return (
          <div className="category-cube" onClick={() => handleOnClick(currCategory)} style={{ backgroundColor: currCategory.color }}>
            <h2>{currCategory.name}</h2>
            <div className="cube-image-container">
              <img src={currCategory.image} alt={currCategory.name} className="cube-image" />
            </div>
          </div>
        );
      case "results":
        return (
          <div className="category-results">
            <h2>{currCategory.name}</h2>
            <div className="grid">{renderStations(categoryStations)}</div>
          </div>
        );
      case "test":
        return (
          <div className="category-test">
            <h2>{currCategory.name}</h2>
            <div className="grid">{renderStations(null)}</div>
          </div>
        );
      default:
        return null;
    }
  };
 
  const renderStations = (renderedStations) => { 
 
    if (renderedStations && renderedStations.length > 0) {
      const startingPosition = currCategory.startingPosition % renderedStations.length;

      return renderedStations.map((station, index) => {
        const mappedIndex = (index + startingPosition) % renderedStations.length;
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
  
  if (currCategory) {
    return renderCategory();
  } else {
    return null;
  }  
};
