import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Design Your Dream Space with AI</h1>
          <p className="hero-subtitle">
            Transform your ideas into reality with our AI-powered floor plan generator.
            Create, customize, and visualize your perfect space in minutes.
          </p>
          <div className="hero-buttons">
            <Link to="/auth" className="hero-button primary">Start Creating</Link>
            <Link to="/projects" className="hero-button secondary">View Playgrounds</Link>
          </div>
        </div>
        <div className="hero-image">
          {/* You can add an illustration or animation here */}
          <div className="placeholder-image">
            <div className="placeholder-floor-plan"></div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2>How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">1</div>
            <h3>Input Dimensions</h3>
            <p>Enter your space requirements and room preferences</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">2</div>
            <h3>AI Generation</h3>
            <p>Our AI creates optimal floor plan layouts</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">3</div>
            <h3>Customize</h3>
            <p>Modify and adjust the generated plans to your needs</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to Create Your Floor Plan?</h2>
        <p>Start designing your perfect space with our AI-powered tool</p>
        <Link to="/auth" className="cta-button">Get Started Now</Link>
      </div>
    </div>
  );
};

export default Home;