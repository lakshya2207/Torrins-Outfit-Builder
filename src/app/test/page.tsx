'use client';

import React, { useRef, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';

const getRandomColor = () =>
  `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`;

const BOX_COUNT = 10;
const BOX_SIZE = 50;
const CONTAINER_WIDTH = 500;
const CONTAINER_HEIGHT = 300;

const DraggableBoxContainer = () => {
  const containerRef = useRef(null);

  // Generate initial boxes once
  const initialBoxes = useMemo(() => {
    return Array.from({ length: BOX_COUNT }, (_, id) => ({
      id,
      color: getRandomColor(),
      top: Math.random() * (CONTAINER_HEIGHT - BOX_SIZE),
      left: Math.random() * (CONTAINER_WIDTH - BOX_SIZE),
    }));
  }, []);

  const [zIndices, setZIndices] = useState(() =>
    Object.fromEntries(initialBoxes.map((box, i) => [box.id, i]))
  );

  // Bring box to front
 const bringToFront = useCallback((id) => {
  setZIndices((prev) => {
    const maxZ = Math.max(...Object.values(prev));
    if (prev[id] === maxZ) return prev; // Already on top
    return { ...prev, [id]: maxZ + 1 };
  });
}, []);


  // Right-click handler
  const handleRightClick = useCallback((e, id) => {
    e.preventDefault();
    bringToFront(id);
  }, [bringToFront]);

  return (
    <div
      ref={containerRef}
      className="w-[500px] h-[300px] border-2 border-black overflow-hidden relative mx-auto mt-10 bg-white"
    >
      {initialBoxes.map((box) => (
        <motion.div
          key={box.id}
          className="w-[50px] h-[50px] absolute rounded cursor-grab flex items-center justify-center text-white text-sm font-bold select-none"
          drag
          dragConstraints={containerRef}
          dragElastic={0.2}
          onContextMenu={(e) => handleRightClick(e, box.id)}
          onMouseDown={() => bringToFront(box.id)}
          style={{
            backgroundColor: box.color,
            top: box.top,
            left: box.left,
            zIndex: zIndices[box.id],
          }}
        >
          {zIndices[box.id]}
        </motion.div>
      ))}
    </div>
  );
};

export default DraggableBoxContainer;
