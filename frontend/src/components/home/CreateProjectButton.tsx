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
      <button
        className="rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700 active:scale-[0.98] cursor-pointer"
        onClick={handleOpenModal}
      >
        新規プロジェクト
      </button>
      {modalIsOpen && <CreateProjectModal handleCloseModal={handleCloseModal} />}
    </>
  )
}