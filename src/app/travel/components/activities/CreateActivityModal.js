import Modal from "@/components/layout/Modal";
import React, { useState } from "react";
import ActivityForm from "./ActivityForm";

const CreateActivityModal = ({ onCreated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleCreate = () => {
    onCreated();
    setIsModalOpen(false);
  };
  return (
    <>
      <button
        onClick={handleOpenModal}
        className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
      >
        Create New Activity
      </button>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ActivityForm onCreated={handleCreate} />
      </Modal>
    </>
  );
};

export default CreateActivityModal;
