"use client"

import { useState, useEffect } from "react"
import CreateProjectModal from "./CreateProjectModalContent"

export default function CreateProjectButton() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleOpenModal = () => {
    setModalIsOpen(true);
  }

  const handleCloseModal = () => {
    setModalIsOpen(false);
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCloseModal();
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
  }, []);

  return (
    <>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
        onClick={handleOpenModal}
      >新規プロジェクト</button>
      {modalIsOpen && <CreateProjectModal handleCloseModal={handleCloseModal} />}
    </>
  )
}