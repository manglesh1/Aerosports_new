"use client";
import React, { useState, useEffect, useCallback } from "react";
import Lightbox from "./Lightbox";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { FaPlay } from "react-icons/fa";

const PhotoGallery = ({ galleryData, navbarName = "gallery" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(null);

  // Get the groups for the specified navbar
  const groups = galleryData[navbarName] || [];

  // Helper function to detect if URL is a video
  const isVideo = (url) => {
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];
    return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
  };

  // Derive a readable title from a URL filename
  const getTitleFromUrl = (url) => {
    try {
      const filename = decodeURIComponent(url.split('/').pop().split('?')[0]);
      // Remove extension, location prefix (aerosports-location-), and numbering
      return filename
        .replace(/\.\w+$/, '')
        .replace(/^aerosports-[\w-]+-/, '')
        .replace(/-\d+$/, '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
    } catch { return ''; }
  };

  // Open modal with specific media
  const openModal = (groupIndex, mediaIndex) => {
    setCurrentGroupIndex(groupIndex);
    setCurrentMediaIndex(mediaIndex);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // Get current group's media list
  const currentUrls = currentGroupIndex !== null && groups[currentGroupIndex]
    ? groups[currentGroupIndex].urls
    : [];

  // Navigate to next/prev media
  const nextMedia = useCallback((e) => {
    if (e) e.stopPropagation();
    setCurrentMediaIndex((prev) => (prev + 1) % currentUrls.length);
  }, [currentUrls.length]);

  const prevMedia = useCallback((e) => {
    if (e) e.stopPropagation();
    setCurrentMediaIndex((prev) => (prev - 1 + currentUrls.length) % currentUrls.length);
  }, [currentUrls.length]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") nextMedia();
      if (e.key === "ArrowLeft") prevMedia();
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, nextMedia, prevMedia]);

  if (!groups || groups.length === 0) {
    return (
      <div className="gallery-empty">
        <p>No gallery content available for this location.</p>
      </div>
    );
  }

  return (
    <div className="photo-gallery-container">
      {groups.map((group, groupIndex) => (
        <div key={groupIndex} className="gallery-section">
          {group.group && (
            <h2 className="gallery-section-title">{group.group}</h2>
          )}
          <div className="gallery-grid">
            {group.urls.map((url, mediaIndex) => {
              const title = (group.titles && group.titles[mediaIndex]) || getTitleFromUrl(url);
              const alt = (group.alttexts && group.alttexts[mediaIndex]) || title || `${group.group || "AeroSports"} photo ${mediaIndex + 1}`;
              return (
                <div
                  key={mediaIndex}
                  className="gallery-item"
                  onClick={() => openModal(groupIndex, mediaIndex)}
                >
                  {isVideo(url) ? (
                    <div className="gallery-video-thumbnail">
                      <video src={url} className="gallery-media" preload="metadata" />
                      <div className="video-play-overlay">
                        <FaPlay size={24} />
                      </div>
                    </div>
                  ) : (
                    <img
                      src={url}
                      alt={alt}
                      width={400}
                      height={300}
                      className="gallery-media"
                      loading="lazy"
                    />
                  )}
                  <div className="gallery-item-overlay">
                    <span className="gallery-item-zoom">&#x1F50D;</span>
                  </div>
                  {title && (
                    <div className="gallery-item-title">{title}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Lightbox Modal */}
      {isModalOpen && currentGroupIndex !== null && currentUrls.length > 0 && (
        <Lightbox isOpen={isModalOpen} onClose={closeModal}>
          <div className="gallery-lightbox">
            {/* Main Media */}
            <div className="gallery-lightbox-media">
              {isVideo(currentUrls[currentMediaIndex]) ? (
                <video
                  src={currentUrls[currentMediaIndex]}
                  controls
                  autoPlay
                  className="gallery-media-full"
                  key={currentMediaIndex}
                />
              ) : (
                <img
                  src={currentUrls[currentMediaIndex]}
                  alt={(groups[currentGroupIndex].alttexts && groups[currentGroupIndex].alttexts[currentMediaIndex]) || `${groups[currentGroupIndex].group || "AeroSports"} photo ${currentMediaIndex + 1}`}
                  className="gallery-media-full"
                  style={{ maxWidth: "100%", maxHeight: "80vh", objectFit: "contain" }}
                />
              )}
            </div>

            {/* Navigation - Only show if more than 1 image */}
            {currentUrls.length > 1 && (
              <>
                <button className="gallery-nav-button gallery-nav-prev" onClick={prevMedia} aria-label="Previous image">
                  <IoChevronBack size={28} />
                </button>
                <button className="gallery-nav-button gallery-nav-next" onClick={nextMedia} aria-label="Next image">
                  <IoChevronForward size={28} />
                </button>
                <div className="gallery-image-counter">
                  {currentMediaIndex + 1} / {currentUrls.length}
                </div>
              </>
            )}

            {/* Thumbnail strip */}
            {currentUrls.length > 1 && (
              <div className="gallery-thumbnail-strip">
                {currentUrls.map((url, i) => (
                  <button
                    key={i}
                    className={`gallery-thumb-btn ${i === currentMediaIndex ? "active" : ""}`}
                    onClick={(e) => { e.stopPropagation(); setCurrentMediaIndex(i); }}
                  >
                    {isVideo(url) ? (
                      <div className="gallery-thumb-video"><FaPlay size={10} /></div>
                    ) : (
                      <img src={url} alt="" width={80} height={60} className="gallery-thumb-img" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Lightbox>
      )}
    </div>
  );
};

export default PhotoGallery;
