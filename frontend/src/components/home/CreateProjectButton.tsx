"use client"

import { useState } from "react"
import CreateProjectModal from "./CreateProjectModal"

export default function CreateProjectButton() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleOpenModal = () => {
    setModalIsOpen(true);
  }

  const handleCloseModal = () => {
    setModalIsOpen(false);
  }

  return (
    <>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
        onClick={handleOpenModal}
      >新規プロジェクト</button>
      {modalIsOpen && <CreateProjectModal/>}
    </>
  )
}