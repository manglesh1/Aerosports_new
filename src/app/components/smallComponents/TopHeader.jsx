"use client";
import React, { useEffect, useState } from "react";
import { IoCloseCircleSharp } from "react-icons/io5";

const TopHeader = () => {
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
    isModalOpen && (
      <>
        <div className="aero_topheader_wrapper">
          <button className="modal-close" onClick={closeModal}>
          <IoCloseCircleSharp />
          </button>
          Open PA Day Monday -23 Sep from 11am to 7pm!
        </div>
      </>
    )
  );
};

export default TopHeader;
