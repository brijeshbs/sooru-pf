import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { playgroundService, floorPlanService } from '../services/api';
import './Playground.css';

const Playground = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // State management
  const [playground, setPlayground] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [dimensions, setDimensions] = useState({
    width: 40,
    length: 60
  });

  const [requirements, setRequirements] = useState({
    bedrooms: 2,
    bathrooms: 2,
    kitchen: true,
    livingRoom: true,
    diningRoom: false,
    study: false
  });

  // Generated plan state
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    fetchPlayground();
  }, [id]);

  const fetchPlayground = async () => {
    try {
      setLoading(true);
      const data = await playgroundService.getPlayground(id);
      setPlayground(data);
      
      if (data.dimensions) {
        setDimensions(data.dimensions);
      }
      if (data.requirements) {
        setRequirements(data.requirements);
      }
      if (data.generatedPlan) {
        setGeneratedPlan(data.generatedPlan);
        drawFloorPlan(data.generatedPlan);
      }
    } catch (err) {
      setError('Failed to load playground');
      console.error('Error loading playground:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDimensionsChange = (e, field) => {
    const value = parseInt(e.target.value, 10) || 0;
    setDimensions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRequirementsChange = (field, value) => {
    setRequirements(prev => ({
      ...prev,
      [field]: typeof value === 'number' ? Math.max(0, value) : value
    }));
  };

  const handleGenerateFloorPlan = async () => {
    // Validate dimensions
    if (dimensions.width < 20 || dimensions.length < 20) {
      setError('Minimum dimensions should be 20ft × 20ft');
      return;
    }

    if (dimensions.width > 200 || dimensions.length > 200) {
      setError('Maximum dimensions should be 200ft × 200ft');
      return;
    }

    try {
      setGenerating(true);
      setError('');
      
      const response = await floorPlanService.generatePlan(id, {
        dimensions,
        requirements
      });

      setGeneratedPlan(response);
      drawFloorPlan(response);
      setSuccess('Floor plan generated successfully!');
      
      // Auto-save the generated plan
      await playgroundService.updatePlayground(id, {
        dimensions,
        requirements,
        generatedPlan: response
      });

    } catch (err) {
      setError('Failed to generate floor plan. Please try again.');
      console.error('Generation error:', err);
    } finally {
      setGenerating(false);
    }
  };

  const drawFloorPlan = (plan) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const scale = 20; // 1 foot = 20 pixels

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size based on dimensions
    canvas.width = dimensions.width * scale;
    canvas.height = dimensions.length * scale;

    // Draw outer walls
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Draw rooms
    plan.rooms.forEach(room => {
      const x = room.position.x * scale;
      const y = room.position.y * scale;
      const width = room.dimensions.width * scale;
      const height = room.dimensions.length * scale;

      // Fill room
      ctx.fillStyle = getRoomColor(room.type);
      ctx.fillRect(x, y, width, height);

      // Draw room border
      ctx.strokeStyle = '#000';
      ctx.strokeRect(x, y, width, height);

      // Add room label
      ctx.fillStyle = '#000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(room.name, x + width/2, y + height/2);

      // Add dimensions
      ctx.font = '12px Arial';
      ctx.fillText(`${room.dimensions.width}'×${room.dimensions.length}'`, 
        x + width/2, y + height - 5);
    });
  };

  const getRoomColor = (type) => {
    const colors = {
      bedroom: '#A8D5E5',
      bathroom: '#95DAC1',
      kitchen: '#FFEBA1',
      living: '#FFA69E',
      dining: '#B8F2E6',
      study: '#E6B8F2'
    };
    return colors[type] || '#FFFFFF';
  };

  const handleSave = async () => {
    try {
      await playgroundService.updatePlayground(id, {
        dimensions,
        requirements,
        generatedPlan
      });
      setSuccess('Changes saved successfully!');
      setIsModified(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save changes');
      console.error('Save error:', err);
    }
  };

  const handleBack = () => {
    if (isModified) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate('/projects');
      }
    } else {
      navigate('/projects');
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading playground...</div>;
  }

  return (
    <div className="playground">
      <div className="playground-header">
        <button onClick={handleBack} className="back-button">
          ← Back to Projects
        </button>
        <h1>{playground?.name}</h1>
      </div>

      {(error || success) && (
        <div className={`alert ${error ? 'alert-error' : 'alert-success'}`}>
          {error || success}
        </div>
      )}

      <div className="playground-content">
        <div className="parameters-panel">
          <section className="dimensions-section">
            <h2>Dimensions</h2>
            <div className="input-group">
              <label>Width (ft)</label>
              <input
                type="number"
                value={dimensions.width}
                onChange={(e) => handleDimensionsChange(e, 'width')}
                min="20"
                max="200"
              />
            </div>
            <div className="input-group">
              <label>Length (ft)</label>
              <input
                type="number"
                value={dimensions.length}
                onChange={(e) => handleDimensionsChange(e, 'length')}
                min="20"
                max="200"
              />
            </div>
          </section>

          <section className="requirements-section">
            <h2>Room Requirements</h2>
            <div className="input-group">
              <label>Bedrooms</label>
              <input
                type="number"
                value={requirements.bedrooms}
                onChange={(e) => handleRequirementsChange('bedrooms', parseInt(e.target.value))}
                min="1"
                max="5"
              />
            </div>
            <div className="input-group">
              <label>Bathrooms</label>
              <input
                type="number"
                value={requirements.bathrooms}
                onChange={(e) => handleRequirementsChange('bathrooms', parseInt(e.target.value))}
                min="1"
                max="4"
              />
            </div>
            
            <div className="checkbox-group">
              {['kitchen', 'livingRoom', 'diningRoom', 'study'].map(room => (
                <label key={room}>
                  <input
                    type="checkbox"
                    checked={requirements[room]}
                    onChange={(e) => handleRequirementsChange(room, e.target.checked)}
                  />
                  {room.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
              ))}
            </div>
          </section>

          <div className="actions">
            <button
              className="generate-button"
              onClick={handleGenerateFloorPlan}
              disabled={generating}
            >
              {generating ? 'Generating...' : 'Generate Floor Plan'}
            </button>
            
            {isModified && (
              <button
                className="save-button"
                onClick={handleSave}
              >
                Save Changes
              </button>
            )}
          </div>
        </div>

        <div className="canvas-panel">
          <canvas
            ref={canvasRef}
            className="floor-plan-canvas"
          />
          {generating && (
            <div className="loading-overlay">
              <div className="loading-spinner" />
              <p>Generating your floor plan...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Playground;