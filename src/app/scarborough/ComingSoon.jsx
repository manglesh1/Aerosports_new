'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PreBookingForm from './PreBookingForm';
import './scarborough.css';

export default function ComingSoon() {
  const [showBookingForm, setShowBookingForm] = useState(false);

  const attractions = [
    {
      title: 'Indoor Go-Kart Racing',
      description: 'Experience the thrill of high-speed racing on our state-of-the-art indoor track!',
      icon: '🏎️',
      isNew: true,
      image: '' // You'll provide this
    },
    {
      title: 'Trampoline Park',
      description: 'Jump, flip, and soar in our massive trampoline arena',
      icon: '🤸',
      image: ''
    },
    {
      title: 'Ninja Tag',
      description: 'Test your skills on our challenging obstacle course',
      icon: '🥷',
      image: ''
    },
    {
      title: 'Zipline, Rope Course and Much More',
      description: 'Experience thrilling adventures with our zipline, rope course, and many exciting attractions',
      icon: '🪂',
      image: ''
    },
    {
      title: 'Birthday Parties',
      description: 'Make your celebration unforgettable with our party packages',
      icon: '🎉',
      image: ''
    }
  ];

  return (
    <div className="scarborough-container">
      {/* Hero Section */}
      <section className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="coming-soon-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <span className="badge-text">OPENING SOON</span>
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Aerosports
            <span className="location-name">Scarborough!</span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            The Ultimate Indoor Entertainment Experience is Coming to Your Neighbourhood
          </motion.p>

          <motion.div
            className="cta-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <button
              className="primary-cta"
              onClick={() => setShowBookingForm(true)}
            >
              Pre-Book Now
              <span className="arrow">→</span>
            </button>
            <a href="#contact" className="secondary-cta">
              Contact Us
            </a>
          </motion.div>
        </motion.div>

        <div className="hero-background">
          <div className="gradient-overlay"></div>
          <motion.div
            className="floating-shapes"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </motion.div>
        </div>
      </section>

      {/* Exclusive Feature Highlight */}
      <section className="exclusive-section">
        <motion.div
          className="exclusive-content"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="exclusive-badge">
            <span>🆕 EXCLUSIVE TO SCARBOROUGH</span>
          </div>
          <h2 className="exclusive-title">Indoor Go-Kart Racing</h2>
          <p className="exclusive-description">
            Be among the first to experience the adrenaline rush of indoor go-kart racing!
            Our cutting-edge track features high-performance electric karts, advanced timing systems,
            and exciting track layouts designed for racers of all skill levels.
          </p>
          <div className="exclusive-features">
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <span>Electric High-Speed Karts</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏁</span>
              <span>Professional Racing Track</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span>Live Timing & Leaderboards</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏆</span>
              <span>Racing Events & Tournaments</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Attractions Grid */}
      <section className="attractions-section">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <h2 className="section-title">What's Coming to Scarborough</h2>
          <p className="section-subtitle">
            Get ready for an action-packed entertainment destination featuring all your favorite activities
          </p>
        </motion.div>

        <div className="attractions-grid">
          {attractions.map((attraction, index) => (
            <motion.div
              key={index}
              className="attraction-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              {attraction.isNew && (
                <div className="new-badge">NEW!</div>
              )}
              <div className="attraction-icon">{attraction.icon}</div>
              <h3 className="attraction-title">{attraction.title}</h3>
              <p className="attraction-description">{attraction.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Location Section */}
      <section className="location-section">
        <motion.div
          className="location-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Find Us</h2>
          <p className="section-subtitle">
            Visit us at our Scarborough location
          </p>

          <div className="location-details">
            <div className="address-card">
              <div className="address-icon">📍</div>
              <div className="address-info">
                <h3>Aerosports Scarborough!</h3>
                <p>1120 Birchmount Rd</p>
                <p>Scarborough, ON M1K 5G4</p>
              </div>
            </div>

            <div className="map-container">
              <iframe
                width="100%"
                height="450"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src="https://maps.google.com/maps?width=100%25&amp;height=450&amp;hl=en&amp;q=1120%20Birchmount%20Rd,%20Scarborough,%20ON%20M1K%205G4+(Aerosports%20Scarborough)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                title="Aerosports Scarborough Location"
              ></iframe>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contact">
        <motion.div
          className="contact-content"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="contact-title">Get in Touch</h2>
          <p className="contact-subtitle">
            Have questions or want to know more about our opening? We'd love to hear from you!
          </p>

          <div className="contact-info">
            <motion.a
              href="tel:+12894545555"
              className="contact-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="contact-icon">📞</div>
              <div className="contact-details">
                <span className="contact-label">Call Us</span>
                <span className="contact-value">(289) 454-5555</span>
              </div>
            </motion.a>

            <motion.a
              href="mailto:events.scb@aerosportsparks.ca"
              className="contact-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="contact-icon">📧</div>
              <div className="contact-details">
                <span className="contact-label">Email Us</span>
                <span className="contact-value">events.scb@aerosportsparks.ca</span>
              </div>
            </motion.a>
          </div>

          <motion.button
            className="prebook-cta"
            onClick={() => setShowBookingForm(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Pre-Book Your Visit
            <span className="cta-arrow">→</span>
          </motion.button>
        </motion.div>
      </section>

      {/* Stay Updated Section */}
      <section className="updates-section">
        <motion.div
          className="updates-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="updates-title">Stay Updated</h2>
          <p className="updates-description">
            Pre-book now and be the first to know when we open our doors.
            Plus, get exclusive early bird offers and special launch promotions!
          </p>
          <div className="benefits-list">
            <div className="benefit-item">
              <span className="benefit-icon">✓</span>
              <span>Priority booking for opening week</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">✓</span>
              <span>Exclusive launch discounts</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">✓</span>
              <span>First access to Go-Kart Racing</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">✓</span>
              <span>Special membership rates</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Pre-Booking Modal */}
      <AnimatePresence>
        {showBookingForm && (
          <PreBookingForm onClose={() => setShowBookingForm(false)} />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="scarborough-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>Aerosports Scarborough!</h3>
            <p>Opening Soon</p>
          </div>
          <div className="footer-social">
            <p>Follow us for updates:</p>
            <div className="social-links">
              <a href="https://www.facebook.com/aerosportsparks" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                Facebook
              </a>
              <a href="https://www.instagram.com/aerosportsparks" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                Instagram
              </a>
              <a href="https://www.tiktok.com/@aerosportsparks" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                TikTok
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Aerosports Parks. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
