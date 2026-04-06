"use client";
import React, { useEffect, useState } from "react";
import Modal from "./Modal";

const LocationPopupModal = ({popupData}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    // Only open modal if we have popup data
    if (popupData && popupData.length > 0 && popupData[0]?.value) {
      openModal();
    }
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
