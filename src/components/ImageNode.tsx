"use client";
import React, { useEffect, useRef, useState } from "react";
import { NodeProps } from "reactflow";
import Image from "next/image";
import { Button } from "./ui/button";
import { IoClose } from "react-icons/io5";

type ImageNodeData = {
  imageURL: string;
  deleteNode?: (id: string) => void;
  name?: string;
  dimensions:{height:number,width:number}
};

const ImageNode = ({ id, data }: NodeProps<ImageNodeData>) => {
  const [size, setSize] = useState({ width: data.dimensions.width, height: data.dimensions.height });

  const nodeRef = useRef<HTMLDivElement>(null);

  const handleResize = () => {
    if (nodeRef.current) {
      setSize({
        width: nodeRef.current.offsetWidth,
        height: nodeRef.current.offsetHeight,
      });
    }
  };

    useEffect(() => {
    // const img = new window.Image();
    // img.src = data.imageURL;

    // img.onload = () => {
    //   let l = 0,b = 0;
    //   l = 200;
    //   b =  (img.naturalWidth / img.naturalHeight) * 200

    //   setOriginalSize({
    //     width: l,
    //     height: b,
    //   });
    //   console.log("img.naturalWidth", l);
    //   console.log("img.naturalHeigth", b);

    //   // Optionally set size to original if desired:
    //   setSize({
    //     height: l,
    //     width: b,
    //   });
    // };
    console.log('data.dimensions',data.dimensions);
    
  }, [data.dimensions]);

  return (
    <div
      ref={nodeRef}
      onMouseUp={handleResize}
      style={{
        width: size.width,
        height: size.height,
        resize: "both",
      }}
      className="relative overflow-hidden rounded-lg shadow-sm bg-white"
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
