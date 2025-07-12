"use client";
import React, { useRef, useState } from "react";
import { NodeProps } from "reactflow";
import Image from "next/image";
import { Button } from "./ui/button";
import { IoClose } from "react-icons/io5";

type ImageNodeData = {
  imageURL: string;
  deleteNode?: (id: string) => void;
  name?: string;
};

const ImageNode = ({ id, data }: NodeProps<ImageNodeData>) => {
  const [size, setSize] = useState({ width: 150, height: 150 });
  const nodeRef = useRef<HTMLDivElement>(null);

  const handleResize = () => {
    if (nodeRef.current) {
      setSize({
        width: nodeRef.current.offsetWidth,
        height: nodeRef.current.offsetHeight,
      });
    }
  };

  return (
    <div
      ref={nodeRef}
      onMouseUp={handleResize}
      style={{ width: size.width, height: size.height, resize: "both" }}
      className="relative max-w-[400px] max-h-[400px] overflow-hidden rounded-lg shadow-sm bg-white"
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -top-2 -right-2 z-50 text-red-600 shadow-sm"
        onClick={(e) => {
          e.stopPropagation();
          data.deleteNode?.(id);
        }}
      >
        <IoClose />
      </Button>
      <Image
        src={data.imageURL}
        alt={data.name || `Node ${id}`}
        fill
        draggable={false}
        className="object-cover select-none pointer-events-none rounded-lg"
        style={{ imageRendering: "auto" }}
      />
    </div>
  );
};

export default ImageNode;
