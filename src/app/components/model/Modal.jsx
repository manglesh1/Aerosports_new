import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "../../styles/modal.css";
import { LiaSkullCrossbonesSolid } from "react-icons/lia";

const Modal = ({ isOpen, onClose, children }) => {
  const [modalRoot, setModalRoot] = useState(null);

  useEffect(() => {
    setModalRoot(document.getElementById("modal-root"));
  }, []);

  if (!isOpen || !modalRoot) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <LiaSkullCrossbonesSolid />
        </button>
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default Modal;
