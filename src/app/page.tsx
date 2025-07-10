"use client";

import React, { useState, useRef } from "react";
import { IoAdd, IoClose, IoShirtOutline } from "react-icons/io5";
import { PiPants } from "react-icons/pi";
import { TbShoe } from "react-icons/tb";
import { BsHandbag } from "react-icons/bs";
import { PiBaseballCap } from "react-icons/pi";
import { RiGlassesFill } from "react-icons/ri";
import { PiBelt } from "react-icons/pi";
import { IoIosArrowRoundBack } from "react-icons/io";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas-pro";
// import products from "@/data/sampleData"

type ImageCategories = {
  accessories: string[];
  tops: string[];
  bottoms: string[];
  shoes: string[];
};
type ImageCategoryKey = keyof ImageCategories;

const Page = () => {
  const [images] = useState<ImageCategories>({
    accessories: [
      "/accessories/belt.jpg",
      "/accessories/belt2.webp",
      "/accessories/cap.png",
      "/accessories/hat.png",
      "/accessories/sunglasses.jpg",
    ],
    tops: [
      "/tops/top1.webp",
      "/tops/top2.jpg",
      "/tops/top3.jpg",
      "/tops/top4.png",
      "/tops/top5.png",
    ],
    bottoms: [
      "/bottoms/bottom1.webp",
      "/bottoms/bottom2.webp",
      "/bottoms/bottom3.jpg",
      "/bottoms/bottom4.png",
      "/bottoms/bottom5.png",
    ],
    shoes: [
      "/shoes/shoes1.webp",
      "/shoes/shoes2.webp",
      "/shoes/shoes3.jpg",
      "/shoes/shoes4.jpg",
      "/shoes/shoes5.png",
    ],
  });


  const [dragImage, setDragImage] = useState("");
  const [selectedProp, setSelectedProp] = useState<ImageCategoryKey | "">("");
  const [dragAreaImages, setDragAreaImages] = useState<string[]>([]);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [layers, setlayers] = useState([1, 2, 3]);
  const [selectedLayer, setSelectedLayer] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleSelect = (prop: ImageCategoryKey | "") => {
    setSelectedProp(prop);
  };

  const handleRemoveImage = (index: number) => {
    setDragAreaImages((prev) => {
      return prev.filter((ele, i) => index != i);
    });
  };
  const takeScreenshot = async () => {
    if (canvasRef.current) {
      const canvas = await html2canvas(canvasRef.current);
      const imgData = canvas.toDataURL("image/png");

      // Optional: download the image
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "screenshot.png";
      link.click();
    }
  };
  return (
    <div className="main h-screen w-screen flex items-center justify-around flex-col bg-gray-100 text-center">
      <h1 className="font-bold text-4xl h-1/12 ">Outfit Builder</h1>

      <div className="box flex flex-col bg-white justify-around rounded-4xl inset-shadow-sm/10 gap-2 h-10/12 w-10/12">
        <div className="section1 w-full flex justify-between items-center gap-2 h-10/12">
          <div className="sidebar w-1/5 h-10/12 p-2 flex flex-col text-sm text-gray-700 font-semibold ">
            {selectedProp === "" ? (
              <>
                <Button
                  variant="outline"
                  className="items h-1/4 m-1 flex flex-col items-center justify-around rounded-md "
                  onClick={() => handleSelect("accessories")}
                >
                  <div className="grid grid-cols-2 grid-rows-2 gap-1">
                    <BsHandbag size={18} />
                    <PiBaseballCap size={18} />
                    <RiGlassesFill size={18} />
                    <PiBelt size={18} />
                  </div>
                  Accessories
                </Button>
                <Button
                  variant="outline"
                  className="items h-1/4 m-1 flex flex-col items-center justify-center rounded-md "
                  onClick={() => handleSelect("tops")}
                >
                  <IoShirtOutline size={35} />
                  Tops
                </Button>
                <Button
                  variant="outline"
                  className="items h-1/4 m-1 flex flex-col items-center justify-center rounded-md"
                  onClick={() => handleSelect("bottoms")}
                >
                  <PiPants size={35} />
                  Bottom
                </Button>
                <Button
                  variant="outline"
                  className="items h-1/4 m-1 flex flex-col items-center justify-center rounded-md"
                  onClick={() => handleSelect("shoes")}
                >
                  <TbShoe size={35} />
                  Shoes
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={() => handleSelect("")}
                >
                  <IoIosArrowRoundBack
                    size={30}
                    // className="border-b-1 border-gray-400 z-10 w-full"
                  />
                </Button>
                <div className="grid grid-cols-2 grid-rows-2 overflow-y-scroll gap-2">
                  {selectedProp &&
                    selectedProp in images &&
                    images[selectedProp as ImageCategoryKey].map(
                      (src, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-center h-full w-full"
                        >
                          <Image
                            src={src}
                            alt={`${selectedProp} ${index + 1}`}
                            width={50}
                            height={50}
                            className="object-contain rounded shadow-md"
                            onDragStart={() => setDragImage(src)}
                          />
                        </div>
                      )
                    )}
                </div>
              </>
            )}
          </div>
          <div className="preview w-4/5 h-full border-l-2">
            <h3 className="font-semibold h-1/12 text-lg text-gray-700 mt-2">
              Canvas Area
            </h3>
            <div className="flex h-10/12 w-11/12 mx-auto font-semibold text-gray-400 bg-white border-dashed border-2 rounded-md">
              <div
                ref={canvasRef}
                className="droparea relative mx-auto  w-10/12 p-4 border-r-2 border-dashed overflow-hidden"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragImage) {
                    setDragAreaImages((prev) => [...prev, dragImage]);
                    setDragImage("");
                  }
                }}
              >
                {dragAreaImages.length > 0 ? (
                  dragAreaImages.map((src, index) => {
                    return (
                      <motion.div
                        key={index}
                        drag
                        dragConstraints={canvasRef}
                        className={`absolute cursor-${
                          draggingIndex === index ? "grabbing" : "grab"
                        }`}
                        onDragStart={() => setDraggingIndex(index)}
                        onDragEnd={() => setDraggingIndex(null)}
                      >
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-4 absolute -top-2 -right-2"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <IoClose />
                        </Button>
                        <Image
                          src={src}
                          alt={`Dropped item ${index + 1}`}
                          width={80}
                          height={80}
                          className="object-contain select-none pointer-events-none"
                          draggable={false}
                        />
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full w-full">
                    <span>Select the props from menu at the left side</span>
                    <span>Drag & Drop the props here</span>
                  </div>
                )}
              </div>
              <div className="layers w-2/12 flex flex-col-reverse overflow-y-scroll">
                <Button
                  variant="ghost"
                  className="w-full flex flex-col items-center justify-around rounded-none h-14"
                onClick={()=>setlayers(prev=>[...prev,prev[prev.length-1]+1])}
                >
                  <IoAdd />
                </Button>
                {layers.map((layer, index) => (
                  <Button
                    key={"layer" + index}
                    variant={selectedLayer==layer?"secondary":"ghost"}
                    onClick={()=>setSelectedLayer(layer)}
                    className="w-full flex flex-col items-center justify-around rounded-none h-14"
                  >
                    Layer {index + 1}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="section2 w-full h-2/12 items-center justify-around flex origin-bottom">
          <Button
            variant="outline"
            className="w-1/6 mx-2"
            onClick={() => setDragAreaImages([])}
          >
            Reset
          </Button>
          <div className="w-4/5 flex justify-around">
            <Button
              variant="outline"
              className="w-5/12"
              onClick={takeScreenshot}
            >
              SaveOutfit
            </Button>
            <Button variant="outline" className="w-5/12">
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
