import React from 'react';
import './Measurements.css';

const Measurements = ({ rooms, dimensions }) => {
  const totalArea = dimensions.width * dimensions.length;
  const roomsArea = rooms.reduce((sum, room) => 
    sum + (room.dimensions.width * room.dimensions.length), 0);
  
  const calculateAreaByType = () => {
    return rooms.reduce((acc, room) => {
      const area = room.dimensions.width * room.dimensions.length;
      acc[room.type] = (acc[room.type] || 0) + area;
      return acc;
    }, {});
  };

  const areaByType = calculateAreaByType();

  return (
    <div className="measurements">
      <h3>Measurements</h3>
      <div className="measurements-content">
        <div className="measurement-item">
          <label>Total Plot Area:</label>
          <span>{totalArea} sq ft</span>
        </div>
        <div className="measurement-item">
          <label>Used Area:</label>
          <span>{roomsArea} sq ft ({((roomsArea/totalArea) * 100).toFixed(1)}%)</span>
        </div>
        <div className="measurement-item">
          <label>Available Area:</label>
          <span>{totalArea - roomsArea} sq ft</span>
        </div>

        <div className="area-by-type">
          <h4>Area by Room Type</h4>
          {Object.entries(areaByType).map(([type, area]) => (
            <div key={type} className="type-area">
              <label>{type.charAt(0).toUpperCase() + type.slice(1)}:</label>
              <span>{area} sq ft ({((area/totalArea) * 100).toFixed(1)}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Measurements;