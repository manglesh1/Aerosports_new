'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function PreBookingForm({ onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    preferredDate: '',
    groupSize: '',
    interests: [],
    specialRequests: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const interestOptions = [
    'Indoor Go-Kart Racing',
    'Trampoline Park',
    'Ninja Tag',
    'Zipline, Rope Course and Much More',
    'Birthday Party',
    'Group Event',
    'Others'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/prebooking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          location: 'Scarborough',
          submittedAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="prebooking-modal"
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="modal-header">
          <h2 className="modal-title">Pre-Book Your Visit</h2>
          <p className="modal-subtitle">
            Reserve your spot at Aerosports Scarborough and get exclusive launch benefits!
          </p>
        </div>

        {submitStatus === 'success' ? (
          <motion.div
            className="success-message"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="success-icon">✓</div>
            <h3>Thank You for Pre-Booking!</h3>
            <p>We've received your information and will contact you soon with exclusive updates and offers.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="prebooking-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="(123) 456-7890"
                />
              </div>

              <div className="form-group">
                <label htmlFor="groupSize">Group Size</label>
                <select
                  id="groupSize"
                  name="groupSize"
                  value={formData.groupSize}
                  onChange={handleChange}
                >
                  <option value="">Select group size</option>
                  <option value="1-5">1-5 people</option>
                  <option value="6-10">6-10 people</option>
                  <option value="11-20">11-20 people</option>
                  <option value="20+">20+ people</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="preferredDate">Preferred Visit Date</label>
              <input
                type="date"
                id="preferredDate"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label>What are you interested in? *</label>
              <div className="checkbox-grid">
                {interestOptions.map((interest) => (
                  <label key={interest} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.interests.includes(interest)}
                      onChange={() => handleCheckboxChange(interest)}
                    />
                    <span className="checkbox-text">{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="specialRequests">Special Requests or Questions</label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                rows="4"
                placeholder="Let us know if you have any special requirements or questions..."
              />
            </div>

            {submitStatus === 'error' && (
              <div className="error-message">
                There was an error submitting your pre-booking. Please try again or contact us directly.
              </div>
            )}

            <div className="form-footer">
              <p className="form-note">
                By submitting this form, you agree to receive updates about Aerosports Scarborough's opening and special offers.
              </p>
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting || formData.interests.length === 0}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Pre-Booking'
                )}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
