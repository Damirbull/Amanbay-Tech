"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Markup } from '@/slices/markupSlice';
import { useDispatch } from 'react-redux';
import { updateMarkup, removeMarkup, setActiveMarkup } from '@/slices/markupSlice';
import MarkupModalEdit from './MarkupModalEdit';


interface MarkupItemProps {
  markup: Markup;
}

const MarkupItem: React.FC<MarkupItemProps> = ({ markup }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingParams, setIsEditingParams] = useState(false);
  const [text, setText] = useState(markup.text);
  const [params, setParams] = useState({
    width: markup.width,
    height: markup.height,
    bgColor: markup.bgColor,
    textColor: markup.textColor,
    fontSize: markup.fontSize,
    borderRadius: markup.borderRadius,
    borderWidth: markup.borderWidth,
    borderColor: markup.borderColor,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const markupRef = useRef<HTMLDivElement>(null);
  const paramsRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditingParams) return;
    if (e.target !== markupRef.current) return;
    
    setIsDragging(true);
    dispatch(setActiveMarkup(markup.id));
    setDragOffset({
      x: e.clientX - markup.x,
      y: e.clientY - markup.y,
    });
    e.stopPropagation();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    dispatch(
      updateMarkup({
        id: markup.id,
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      })
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleTextBlur = () => {
    dispatch(updateMarkup({ id: markup.id, text }));
    setIsEditing(false);
  };

  const handleParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: name.includes('Color') ? value : Number(value),
    }));
  };

  const handleColorChange = (name: string, value: string) => {
    setParams(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleParamsSubmit = () => {
    dispatch(updateMarkup({ id: markup.id, ...params }));
    setIsEditingParams(false);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleParamsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingParams(true);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeMarkup(markup.id));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (paramsRef.current && !paramsRef.current.contains(e.target as Node)) {
        setIsEditingParams(false);
      }
    };

    if (isEditingParams) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditingParams]);

  return (
    <>
      <div
        ref={markupRef}
        className={`absolute p-2 ${isDragging ? 'cursor-grabbing' : 'cursor-move'}`}
        style={{
          left: `${markup.x}px`,
          top: `${markup.y}px`,
          width: `${markup.width}px`,
          height: `${markup.height}px`,
          backgroundColor: markup.bgColor,
          color: markup.textColor,
          fontSize: `${markup.fontSize}px`,
          borderRadius: `${markup.borderRadius}px`,
          border: `${markup.borderWidth}px solid ${markup.borderColor}`,
          zIndex: isDragging ? 1000 : 1,
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        {isEditing ? (
          <textarea
            className="w-full h-full bg-transparent resize-none outline-none"
            value={text}
            onChange={handleTextChange}
            onBlur={handleTextBlur}
            autoFocus
          />
        ) : (
          <div className="w-full h-full overflow-auto">{markup.text}</div>
        )}
        <div className="absolute top-0 right-0 flex">
          <button
            className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-1"
            onClick={handleParamsClick}
          >
            ⚙️
          </button>
          <button
            className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            onClick={handleRemove}
          >
            ×
          </button>
        </div>
      </div>

      {isEditingParams && (
        <MarkupModalEdit
          params={params}
          onParamChange={handleParamChange}
          onColorChange={handleColorChange}
          onSubmit={handleParamsSubmit}
          position={{
            left: markup.x + markup.width + 10,
            top: markup.y,
          }}
        />
      )}
    </>
  );
};

export default MarkupItem;