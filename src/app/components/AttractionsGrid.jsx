'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import "../styles/attractions.css";

const AttractionsGrid = ({ attractionsData, waiverLink, locationSlug }) => {
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [attractionDetails, setAttractionDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Close modal on ESC key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const openModal = async (attraction) => {
    setSelectedAttraction(attraction);
    setIsModalOpen(true);
    setIsLoading(true);

    try {
      // Fetch the full attraction page content
      const response = await fetch(`/api/attraction-details?location=${locationSlug}&category=${attraction.parentid}&subcategory=${attraction.path}`);
      if (response.ok) {
        const data = await response.json();
        setAttractionDetails(data);
      }
    } catch (error) {
      console.error('Error fetching attraction details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedAttraction(null);
      setAttractionDetails(null);
    }, 300);
  };

  const handleModalBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <>
      {/* Decorative Background Elements */}
      <div className="aero_attractions_decorative_bg">
        <div className="aero_attractions_confetti aero_attractions_confetti_1"></div>
        <div className="aero_attractions_confetti aero_attractions_confetti_2"></div>
        <div className="aero_attractions_confetti aero_attractions_confetti_3"></div>
        <div className="aero_attractions_confetti aero_attractions_confetti_4"></div>
        <div className="aero_attractions_confetti aero_attractions_confetti_5"></div>

        <div className="aero_attractions_circle aero_attractions_circle_1"></div>
        <div className="aero_attractions_circle aero_attractions_circle_2"></div>
        <div className="aero_attractions_circle aero_attractions_circle_3"></div>

        <div className="aero_attractions_star aero_attractions_star_1">✨</div>
        <div className="aero_attractions_star aero_attractions_star_2">⭐</div>
        <div className="aero_attractions_star aero_attractions_star_3">✨</div>
        <div className="aero_attractions_star aero_attractions_star_4">⭐</div>
      </div>

      {/* Attractions Grid */}
      <div className="aero_attractions_grid">
        {attractionsData?.map((item, i) => (
          <article
            key={i}
            className="aero_attraction_card"
            onClick={() => openModal(item)}
          >
            <div className="aero_attraction_card_image_wrap">
              <img
                src={item?.smallimage}
                alt={item?.title || item?.desc}
                className="aero_attraction_card_image"
              />
              <div className="aero_attraction_card_image_overlay"></div>
            </div>

            <div className="aero_attraction_card_content">
              <h2 className="aero_attraction_card_title">{item?.desc}</h2>
              <p className="aero_attraction_card_description">
                {item?.smalltext || item?.text || "Discover the excitement and adventure waiting for you!"}
              </p>
              <div className="aero_attraction_card_cta">
                Learn More →
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && selectedAttraction && (
        <div
          className="aero_attraction_modal"
          onClick={handleModalBackdropClick}
        >
          <div className="aero_attraction_modal_content">
            <button
              className="aero_attraction_modal_close"
              onClick={closeModal}
              aria-label="Close modal"
            >
              ✕
            </button>

            <div className="aero_attraction_modal_body">
              {isLoading ? (
                <div className="aero_attraction_modal_loading">
                  <div className="aero_attraction_modal_loading_spinner">⏳</div>
                  <p>Loading attraction details...</p>
                </div>
              ) : (
                <>
                  <h2 className="aero_attraction_modal_title">
                    {attractionDetails?.title || selectedAttraction?.desc}
                  </h2>

                  {/* Main Content Section */}
                  {attractionDetails?.section1 && (
                    <div
                      className="aero_attraction_modal_description"
                      dangerouslySetInnerHTML={{ __html: attractionDetails.section1 }}
                    />
                  )}

                  {/* SEO Section */}
                  {attractionDetails?.seosection && (
                    <div
                      className="aero_attraction_modal_description"
                      dangerouslySetInnerHTML={{ __html: attractionDetails.seosection }}
                    />
                  )}

                  {/* Action Buttons */}
                  <div className="aero_attraction_modal_actions">
                    <button
                      onClick={closeModal}
                      className="aero_attraction_modal_action aero_attraction_modal_back"
                    >
                      ← Back to Attractions
                    </button>
                    {waiverLink && (
                      <a
                        href={waiverLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="aero_attraction_modal_action"
                      >
                        Book Now →
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AttractionsGrid;
