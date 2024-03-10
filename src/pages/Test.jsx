import React from 'react';
import { CategoryDisplay } from '../cmps/CategoryDisplay';
import { categoryService } from '../services/category.service';
import { StationPreview } from '../cmps/StationPreview';

export const Test = ({ setCurrentCategory }) => {

    const demoCategory = [{
        "_id": "fakeId",
        "name": "",
        "stationIds": [],
        "color": "",
        "image": ""
      }]

    return (
        <div className="test">
            <CategoryDisplay 
                key={"categoryId"}
                category={demoCategory}
                style={categoryService.Status.TEST}
                setCurrentCategory={setCurrentCategory}
            />
        </div>
    );
};
