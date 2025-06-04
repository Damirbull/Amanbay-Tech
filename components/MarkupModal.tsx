import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addMarkup, updateMarkup } from '@/slices/markupSlice'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const DEFAULT_FORM_VALUES = {
  text: 'Новая маркировка',
  x: 100,
  y: 100,
  width: 200,
  height: 150,
  bgColor: '#ffffff',
  textColor: '#000000',
  fontSize: 16,
  borderRadius: 4,
  borderWidth: 1,
  borderColor: '#cccccc',
}

const MarkupModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const [form, setForm] = useState(DEFAULT_FORM_VALUES)

  useEffect(() => {
    if (isOpen) {
      setForm(DEFAULT_FORM_VALUES)
    }
  }, [isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: ['x', 'y', 'width', 'height', 'fontSize', 'borderRadius', 'borderWidth'].includes(name)
        ? (value === '' ? '' : Number(value))
        : value
    }))
  }

  const handleColorChange = (name: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = () => {
    const action = addMarkup()
    dispatch(action)
    dispatch(updateMarkup({ id: action.payload.id, ...form }))
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-[400px] space-y-4 max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-semibold">Новая маркировка</h2>

        {Object.entries(form).map(([key, value]) => {
          if (key.endsWith('Color')) {
            return (
              <div key={key} className="flex flex-col">
                <label className="text-sm text-gray-600">{key}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={value as string}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="w-10 h-10 cursor-pointer"
                  />
                  <input
                    type="text"
                    name={key}
                    value={value as string}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 flex-1"
                  />
                </div>
              </div>
            )
          }
          return (
            <div key={key} className="flex flex-col">
              <label className="text-sm text-gray-600">{key}</label>
              <input
                type={typeof value === 'number' ? 'number' : 'text'}
                name={key}
                value={value === undefined || value === null ? '' : value} 
                min={typeof value === 'number' ? 0 : undefined}
                onChange={handleChange}
                className="border rounded px-2 py-1"
              />
            </div>
          )
        })}

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={onClose}
          >
            Отмена
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleSubmit}
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  )
}

export default MarkupModal