"use client";
import React, { useEffect, useState } from "react";
import Modal from "./Modal"; 

const PromotionModal = ({promotionPopup}) => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const handleDOMContentLoaded = () => {
      openModal();
    };

    window.addEventListener("DOMContentLoaded", handleDOMContentLoaded);

    return () => {
      window.removeEventListener("DOMContentLoaded", handleDOMContentLoaded);
    };
  }, []);

  const sanitizedHTML = promotionPopup[0]?.value?.replace(/<br\s*\/?>/gi, '') || '';
  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div dangerouslySetInnerHTML={{__html: sanitizedHTML || ''}} className="aero_promotion_popup"></div>
      </Modal>
    </div>
  );
};

export default PromotionModal;
