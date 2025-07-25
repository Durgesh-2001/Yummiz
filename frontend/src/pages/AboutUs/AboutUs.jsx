import React from 'react'
import './AboutUs.css'

const AboutUs = () => {
  return (
    <div className="page-container">
      <div className="about-us-content">
        <h1 className="page-title">About Yummiz</h1>
        
        <section className="main-description">
          <p>Yummiz is your Ultimate Food Recipe Web Application, designed to make cooking and food discovery a delightful experience. We connect food enthusiasts with amazing recipes, complete with detailed instructions, ratings, and preparation times.</p>
          <ul className="feature-points">
            <li>Easy-to-follow recipe instructions</li>
            <li>Real user ratings</li>
            <li>Accurate preparation time estimates</li>
          </ul>
        </section>

        <section className="features">
          <h2>What We Offer</h2>
          <div className="feature-grid">
            <div className="feature-item">
              <h3>Recipe Discovery</h3>
              <p>Browse through categorized recipes and find your next culinary adventure</p>
              <ul className="feature-points">
                <li>Browse by cuisine type</li>
                <li>Filter by cooking time</li>
              </ul>
            </div>
            <div className="feature-item">
              <h3>User Experience</h3>
              <p>Enjoy a mobile-responsive design with intuitive navigation and modern animations</p>
              <ul className="feature-points">
                <li>Responsive on all devices</li>
                <li>Intuitive search and filters</li>
                <li>Smooth animations</li>
              </ul>
            </div>
            <div className="feature-item">
              <h3>Authentication</h3>
              <p>Secure access with email/password login and OTP verification</p>
              <ul className="feature-points">
                <li>Multiple login options</li>
                <li>Secure OTP verification</li>
              </ul>
            </div>
            <div className="feature-item">
              <h3>Personal Collection</h3>
              <p>Save your favorite recipes and create your personal cookbook</p>
              <ul className="feature-points">
                <li>Save favorite recipes</li>
                <li>Create collections</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="tech-stack">
          <h2>Built with Modern Technology</h2>
          <p>Powered by React and Vite for the frontend, Express.js and MongoDB for the backend, ensuring a fast and reliable experience.</p>
          <ul className="feature-points">
            <li>Fast and responsive UI with React</li>
            <li>Reliable data storage with MongoDB</li>
            <li>Secure API endpoints with Express.js</li>
          </ul>
        </section>

        <section className="mission">
          <h2>Our Mission</h2>
          <p>We strive to make cooking accessible and enjoyable for everyone by providing a comprehensive platform for recipe discovery and sharing.</p>
          <ul className="feature-points">
            <li>Empower home cooks</li>
            <li>Build cooking communities</li>
            <li>Preserve culinary traditions</li>
          </ul>
        </section>
      </div>
    </div>
  )
}

export default AboutUs
