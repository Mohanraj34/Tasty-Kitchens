import {
  FaPinterestSquare,
  FaInstagram,
  FaTwitter,
  FaFacebookSquare,
} from 'react-icons/fa'

import './index.css'

const Footer = () => (
  <footer className="footer-container">
    <div className="website-logo-container">
      <img
        className="website-logo"
        src="https://res.cloudinary.com/pavankalyanbandaru/image/upload/v1651083036/tasty-kitchens/footer-website-logo.png"
        alt="website-footer-logo"
      />
      <h1 className="website-title footer-title">Tasty Kitchen</h1>
    </div>

    <p className="footer-description">
      The only thing we are serious about is food. <br />
      Contact us on.
    </p>

    <div className="social-media-links-container">
      <div>
        <FaPinterestSquare className="social-media-link" />
      </div>

      <div>
        <FaInstagram className="social-media-link" />
      </div>

      <div>
        <FaTwitter className="social-media-link" />
      </div>

      <div>
        <FaFacebookSquare className="social-media-link" />
      </div>
    </div>
  </footer>
)

export default Footer
