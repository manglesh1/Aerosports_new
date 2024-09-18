"use client";
import React, { useEffect, useState } from "react";
import Modal from "./Modal"; 

const PromotionModal = () => {
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
  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2>Modal Content</h2>
        <p>This is a modal using React portals!</p>
      </Modal>
    </div>
  );
};

export default PromotionModal;
