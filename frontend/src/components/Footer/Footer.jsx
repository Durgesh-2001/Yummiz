import { Link } from 'react-router-dom'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="Logo" />
          <p>© {currentYear} All rights reserved</p>
          <div className="footer-social-icons">
          <a href="https://www.instagram.com/durgesh_dxj" target="_blank" rel="noopener noreferrer">
              <img src={assets.instagram_icon} alt="Instagram" />
            </a>
            <a href="https://x.com/Durgesh_offl" target="_blank" rel="noopener noreferrer">
              <img src={assets.twitter_icon} alt="Twitter" />
            </a>
            <a href="https://www.linkedin.com/in/durgeshjay" target="_blank" rel="noopener noreferrer">
              <img src={assets.linkedin_icon} alt="LinkedIn" />
            </a>
          </div>
        </div>

        <div className="footer-content-center">
          <ul>
            <li onClick={scrollToTop}>Home</li>
            <li>
              <Link to="/about-us">About us</Link>
            </li>
            <li>
              <Link to="/legal">Privacy Policy</Link>
            </li>
          </ul>
        </div>

        <div className="footer-content-right">
          <h2>Get in touch</h2>
          <ul>
            <li>Bengaluru,Karnataka</li>
            <li>Phone:7975956486</li>
            <li>Email:dj26112001@gmail.com</li>
          </ul>

          <div className="footer-subscribe">
            <input type="email" placeholder="Your email" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>
      <hr />
      <p className='footer-text'>Made with 🧠 & ❤ by Durgesh</p>
    </div>
  )
}

export default Footer