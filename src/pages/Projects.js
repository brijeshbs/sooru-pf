import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { playgroundService } from '../services/api';
import './Projects.css';

const Projects = () => {
  const navigate = useNavigate();
  const [playgrounds, setPlaygrounds] = useState([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newPlaygroundName, setNewPlaygroundName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('lastModified'); // 'lastModified' or 'name'

  useEffect(() => {
    fetchPlaygrounds();
  }, []);

  const fetchPlaygrounds = async () => {
    try {
      setLoading(true);
      const data = await playgroundService.getAllPlaygrounds();
      setPlaygrounds(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch playgrounds');
      console.error('Error fetching playgrounds:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlayground = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const newPlayground = await playgroundService.createPlayground({
        name: newPlaygroundName,
        dimensions: { width: 0, length: 0 }, // Default dimensions
        createdAt: new Date()
      });
      
      setPlaygrounds([...playgrounds, newPlayground]);
      setNewPlaygroundName('');
      setShowNewModal(false);
      navigate(`/playground/${newPlayground._id}`);
    } catch (err) {
      setError('Failed to create playground');
      console.error('Error creating playground:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlayground = async (id) => {
    if (window.confirm('Are you sure you want to delete this playground? This action cannot be undone.')) {
      try {
        await playgroundService.deletePlayground(id);
        setPlaygrounds(playgrounds.filter(p => p._id !== id));
        setError('');
      } catch (err) {
        setError('Failed to delete playground');
        console.error('Error deleting playground:', err);
      }
    }
  };

  const handleOpenPlayground = (id) => {
    navigate(`/playground/${id}`);
  };

  // Filter and sort playgrounds
  const filteredPlaygrounds = playgrounds
    .filter(playground => 
      playground.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return new Date(b.lastModified) - new Date(a.lastModified);
    });

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>My Playgrounds</h1>
        <button 
          className="new-project-button"
          onClick={() => setShowNewModal(true)}
        >
          Create New Playground
        </button>
      </div>

      <div className="projects-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search playgrounds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="sort-control">
          <label>Sort by: </label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="lastModified">Last Modified</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading && !showNewModal ? (
        <div className="loading-spinner">Loading playgrounds...</div>
      ) : (
        <div className="projects-grid">
          {filteredPlaygrounds.length === 0 ? (
            <div className="no-projects">
              <p>No playgrounds found. Create your first playground to get started!</p>
            </div>
          ) : (
            filteredPlaygrounds.map(playground => (
              <div key={playground._id} className="project-card">
                <div className="project-card-header">
                  <h3>{playground.name}</h3>
                  <button 
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePlayground(playground._id);
                    }}
                    title="Delete Playground"
                  >
                    ×
                  </button>
                </div>
                <div className="project-info">
                  <p>Created: {new Date(playground.createdAt).toLocaleDateString()}</p>
                  <p>Last Modified: {new Date(playground.lastModified).toLocaleDateString()}</p>
                  {playground.dimensions.width > 0 && (
                    <p>Size: {playground.dimensions.width}' × {playground.dimensions.length}'</p>
                  )}
                </div>
                <button 
                  className="view-project-button"
                  onClick={() => handleOpenPlayground(playground._id)}
                >
                  Open Playground
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create New Playground Modal */}
      {showNewModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create New Playground</h2>
            <form onSubmit={handleCreatePlayground}>
              <div className="form-group">
                <label>Playground Name:</label>
                <input
                  type="text"
                  value={newPlaygroundName}
                  onChange={(e) => setNewPlaygroundName(e.target.value)}
                  placeholder="Enter playground name"
                  required
                  autoFocus
                  minLength={3}
                  maxLength={50}
                />
              </div>
              <div className="modal-buttons">
                <button 
                  type="button" 
                  onClick={() => setShowNewModal(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create & Open'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;