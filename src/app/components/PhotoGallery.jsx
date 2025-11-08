"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Lightbox from "./Lightbox";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { FaPlay } from "react-icons/fa";

const PhotoGallery = ({ galleryData, navbarName = "gallery" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [showControls, setShowControls] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const hideControlsTimeoutRef = useRef(null);

  // Get the groups for the specified navbar
  const groups = galleryData[navbarName] || [];

  // Helper function to detect if URL is a video
  const isVideo = (url) => {
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];
    return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
  };

  // Open modal with specific media
  const openModal = (groupIndex, mediaIndex) => {
    setCurrentGroup(groupIndex);
    setCurrentMediaIndex(mediaIndex);
    setIsModalOpen(true);
    setShowControls(true);
  };

  // Navigate to next media
  const nextMedia = (e) => {
    if (e) e.stopPropagation();
    if (currentGroup !== null && groups[currentGroup]) {
      const totalMedia = groups[currentGroup].urls.length;
      setCurrentMediaIndex((prev) => (prev + 1) % totalMedia);
    }
  };

  // Navigate to previous media
  const prevMedia = (e) => {
    if (e) e.stopPropagation();
    if (currentGroup !== null && groups[currentGroup]) {
      const totalMedia = groups[currentGroup].urls.length;
      setCurrentMediaIndex((prev) => (prev - 1 + totalMedia) % totalMedia);
    }
  };

  // Handle mouse movement to show/hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
    hideControlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 2000);
  };

  // Touch handlers for swipe gestures
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextMedia();
    } else if (isRightSwipe) {
      prevMedia();
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") nextMedia();
    if (e.key === "ArrowLeft") prevMedia();
    if (e.key === "Escape") setIsModalOpen(false);
  };

  useEffect(() => {
    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isModalOpen, currentGroup, currentMediaIndex]);

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
            {group.urls.map((url, mediaIndex) => (
              <div
                key={mediaIndex}
                className="gallery-item"
                onClick={() => openModal(groupIndex, mediaIndex)}
              >
                {isVideo(url) ? (
                  <div className="gallery-video-thumbnail">
                    <video
                      src={url}
                      className="gallery-media"
                      preload="metadata"
                    />
                    <div className="video-play-overlay">
                      <FaPlay size={32} />
                    </div>
                  </div>
                ) : (
                  <Image
                    src={url}
                    alt={group.group || "Gallery image"}
                    width={400}
                    height={300}
                    className="gallery-media"
                    unoptimized
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Modern Lightbox */}
      {isModalOpen && currentGroup !== null && groups[currentGroup] && (
        <Lightbox isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div
            className="gallery-lightbox"
            onMouseMove={handleMouseMove}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Main Media */}
            <div className="gallery-lightbox-media">
              {isVideo(groups[currentGroup].urls[currentMediaIndex]) ? (
                <video
                  src={groups[currentGroup].urls[currentMediaIndex]}
                  controls
                  autoPlay
                  className="gallery-media-full"
                  key={currentMediaIndex}
                />
              ) : (
                <img
                  src={groups[currentGroup].urls[currentMediaIndex]}
                  alt={groups[currentGroup].group || "Gallery image"}
                  className="gallery-media-full"
                />
              )}
            </div>

            {/* Side Navigation - Only show if more than 1 image */}
            {groups[currentGroup].urls.length > 1 && (
              <>
                <button
                  className={`gallery-nav-button gallery-nav-prev ${showControls ? 'visible' : ''}`}
                  onClick={prevMedia}
                  aria-label="Previous image"
                >
                  <IoChevronBack size={28} />
                </button>

                <button
                  className={`gallery-nav-button gallery-nav-next ${showControls ? 'visible' : ''}`}
                  onClick={nextMedia}
                  aria-label="Next image"
                >
                  <IoChevronForward size={28} />
                </button>

                {/* Image Counter */}
                <div className={`gallery-image-counter ${showControls ? 'visible' : ''}`}>
                  {currentMediaIndex + 1} / {groups[currentGroup].urls.length}
                </div>
              </>
            )}
          </div>
        </Lightbox>
      )}
    </div>
  );
};

export default PhotoGallery;
