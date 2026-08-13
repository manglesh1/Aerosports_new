"use client";
import React, { useEffect, useState } from "react";
import Modal from "./Modal";

const LocationPopupModal = ({popupData}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (!popupData || popupData.length === 0 || !popupData[0]?.value) {
      return undefined;
    }

    const openOnce = () => {
      openModal();
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener("click", openOnce);
      window.removeEventListener("keydown", openOnce);
      window.removeEventListener("scroll", openOnce);
      window.removeEventListener("touchstart", openOnce);
    };

    window.addEventListener("click", openOnce, { once: true });
    window.addEventListener("keydown", openOnce, { once: true });
    window.addEventListener("scroll", openOnce, { once: true, passive: true });
    window.addEventListener("touchstart", openOnce, { once: true, passive: true });

    return cleanup;
  }, [popupData]);

  // If no popup data, don't render anything
  if (!popupData || popupData.length === 0 || !popupData[0]?.value) {
    return null;
  }

  const sanitizedHTML = popupData[0]?.value?.replace(/<br\s*\/?>/gi, '') || '';

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div dangerouslySetInnerHTML={{__html: sanitizedHTML || ''}} className="aero_location_popup"></div>
      </Modal>
    </div>
  );
};

export default LocationPopupModal;
