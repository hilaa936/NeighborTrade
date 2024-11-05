"use client";

// components/Modal.js
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  // Close modal on outside click
  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-background") {
      onClose();
    }
  };
  return (
    <div
      id="modal-background"
      onClick={handleOutsideClick}
      className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-30"
    >
      <div className="relative bg-white p-6 rounded-lg w-full sm:w-96">
        <button
          className="absolute text-lg top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
