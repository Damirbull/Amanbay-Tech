import React from 'react';

interface MarkupModalEditProps {
  params: {
    width: number;
    height: number;
    bgColor: string;
    textColor: string;
    fontSize: number;
    borderRadius: number;
    borderWidth: number;
    borderColor: string;
  };
  onParamChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onColorChange: (name: string, value: string) => void;
  onSubmit: () => void;
  position: { left: number; top: number };
}

const MarkupModalEdit: React.FC<MarkupModalEditProps> = ({
  params,
  onParamChange,
  onColorChange,
  onSubmit,
  position,
}) => {
  return (
    <div
      className="absolute bg-white p-4 rounded shadow-lg z-50"
      style={{
        left: `${position.left}px`,
        top: `${position.top}px`,
        minWidth: '250px',
      }}
    >
      <h3 className="font-bold mb-2">Редактирование параметров</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(params).map(([key, value]) => {
          if (key.endsWith('Color')) {
            return (
              <div key={key} className="flex flex-col">
                <label className="text-sm text-gray-600">{key}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={value as string}
                    onChange={(e) => onColorChange(key, e.target.value)}
                    className="w-6 h-6 cursor-pointer"
                  />
                  <input
                    type="text"
                    name={key}
                    value={value as string}
                    onChange={onParamChange}
                    className="border rounded px-2 py-1 flex-1 text-sm"
                  />
                </div>
              </div>
            );
          }
          
          return (
            <div key={key} className="flex flex-col">
              <label className="text-sm text-gray-600">{key}</label>
              <input
                type="number"
                name={key}
                value={value}
                onChange={onParamChange}
                min={0}
                className="border rounded px-2 py-1"
              />
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-end mt-3">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={onSubmit}
        >
          Применить
        </button>
      </div>
    </div>
  );
};

export default MarkupModalEdit;