'use client';

import MarkupItem from "@/components/MarkupItem";
import Toolbar from "@/components/Toolbar";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";
import { loadMarkups } from '@/slices/markupSlice'


export default function Home() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(loadMarkups());
  }, []);

  const markups = useAppSelector((state) => state.markup.markups)

  return (
    <div className="min-h-screen bg-gray-50">
      <Toolbar/>
      <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden">
        {markups.map((markup) => (
          <MarkupItem key={markup.id} markup={markup} />
        ))}
      </div>
    </div>
  );
}
