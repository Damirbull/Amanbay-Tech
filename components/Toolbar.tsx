import React, { useState } from 'react'
import MarkupModal from './MarkupModal'

const Toolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="flex gap-2 p-4 bg-gray-100">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setIsOpen(true)}
        >
          Добавить маркировку
        </button>
      </div>
      <MarkupModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

export default Toolbar
