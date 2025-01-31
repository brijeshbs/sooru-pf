import React from 'react';
import './RoomEditor.css';

const RoomEditor = ({ 
  selectedRoom, 
  onUpdateRoom, 
  onDeleteRoom,
  availableTypes = [
    'bedroom', 
    'bathroom', 
    'kitchen', 
    'living', 
    'dining', 
    'study', 
    'entry', 
    'hallway'
  ]
}) => {
  if (!selectedRoom) return null;

  const handleChange = (field, value) => {
    onUpdateRoom({
      ...selectedRoom,
      [field]: value
    });
  };

  const handleDimensionChange = (dimension, value) => {
    const numValue = parseInt(value) || 0;
    onUpdateRoom({
      ...selectedRoom,
      dimensions: {
        ...selectedRoom.dimensions,
        [dimension]: numValue
      }
    });
  };

  const handlePositionChange = (axis, value) => {
    const numValue = parseInt(value) || 0;
    onUpdateRoom({
      ...selectedRoom,
      position: {
        ...selectedRoom.position,
        [axis]: numValue
      }
    });
  };

  return (
    <div className="room-editor">
      <div className="editor-header">
        <h3>Edit Room</h3>
        <button 
          onClick={() => onDeleteRoom(selectedRoom.id)}
          className="delete-room-button"
          title="Delete Room"
        >
          ×
        </button>
      </div>

      <div className="editor-content">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={selectedRoom.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="editor-input"
          />
        </div>

        <div className="form-group">
          <label>Type</label>
          <select
            value={selectedRoom.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="editor-input"
          >
            {availableTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="dimensions-group">
          <h4>Dimensions</h4>
          <div className="input-row">
            <div className="form-group">
              <label>Width (ft)</label>
              <input
                type="number"
                value={selectedRoom.dimensions.width}
                onChange={(e) => handleDimensionChange('width', e.target.value)}
                min="1"
                className="editor-input"
              />
            </div>
            <div className="form-group">
              <label>Length (ft)</label>
              <input
                type="number"
                value={selectedRoom.dimensions.length}
                onChange={(e) => handleDimensionChange('length', e.target.value)}
                min="1"
                className="editor-input"
              />
            </div>
          </div>
        </div>

        <div className="position-group">
          <h4>Position</h4>
          <div className="input-row">
            <div className="form-group">
              <label>X (ft)</label>
              <input
                type="number"
                value={selectedRoom.position.x}
                onChange={(e) => handlePositionChange('x', e.target.value)}
                className="editor-input"
              />
            </div>
            <div className="form-group">
              <label>Y (ft)</label>
              <input
                type="number"
                value={selectedRoom.position.y}
                onChange={(e) => handlePositionChange('y', e.target.value)}
                className="editor-input"
              />
            </div>
          </div>
        </div>

        <div className="measurements-info">
          <p>Area: {selectedRoom.dimensions.width * selectedRoom.dimensions.length} sq ft</p>
          <p>Perimeter: {2 * (selectedRoom.dimensions.width + selectedRoom.dimensions.length)} ft</p>
        </div>
      </div>
    </div>
  );
};

export default RoomEditor;