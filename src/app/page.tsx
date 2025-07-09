"use client";

import React, { useState } from "react";
import { IoShirtOutline } from "react-icons/io5";
import { PiPants } from "react-icons/pi";
import { TbShoe } from "react-icons/tb";
import { BsHandbag } from "react-icons/bs";
import { PiBaseballCap } from "react-icons/pi";
import { RiGlassesFill } from "react-icons/ri";
import { PiBelt } from "react-icons/pi";
import { IoIosArrowRoundBack } from "react-icons/io";

import Image from "next/image";
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

  const handleSelect = (prop: ImageCategoryKey | "") => {
    setSelectedProp(prop);
  };

  return (
    <div className="main h-screen w-screen flex items-center justify-center flex-col gap-5 text-center">
      <h1 className="font-bold text-4xl">Outfit Builder</h1>
      <div className="box bg-gray-200 p-10 flex justify-between rounded-2xl shadow-xl gap-2 h-10/12 w-xl">
        <div className="sidebar w-1/5 flex flex-col border-2 text-sm text-gray-700 font-semibold rounded-md border-gray-400">
          {selectedProp === "" ? (
            <>
              <div
                className="items h-1/4 m-1 p-5 flex flex-col items-center rounded-md bg-gray-300"
                onClick={() => handleSelect("accessories")}
              >
                <div className="grid grid-cols-2 grid-rows-2 gap-2">
                  <BsHandbag size={20} />
                  <PiBaseballCap size={20} />
                  <RiGlassesFill size={20} />
                  <PiBelt size={20} />
                </div>
                Accessories
              </div>
              <div
                className="items h-1/4 m-1 p-5 flex flex-col items-center rounded-md bg-gray-300"
                onClick={() => handleSelect("tops")}
              >
                <IoShirtOutline size={35} />
                Tops
              </div>
              <div
                className="items h-1/4 m-1 p-5 flex flex-col items-center rounded-md bg-gray-300"
                onClick={() => handleSelect("bottoms")}
              >
                <PiPants size={35} />
                Bottom
              </div>
              <div
                className="items h-1/4 m-1 p-5 flex flex-col items-center rounded-md bg-gray-300"
                onClick={() => handleSelect("shoes")}
              >
                <TbShoe size={35} />
                Shoes
              </div>
            </>
          ) : (
            <>
              <IoIosArrowRoundBack
                onClick={() => handleSelect("")}
                size={30}
                className="border-b-1 border-gray-400 z-10 w-full"
              />
              <div className="grig grid-cols-4 overflow-y-scroll gap-2">
                {selectedProp &&
                  selectedProp in images &&
                  images[selectedProp as ImageCategoryKey].map((src, index) => (
                    <Image
                      key={index}
                      src={src}
                      alt={`${selectedProp} ${index + 1}`}
                      width={50}
                      height={50}
                      className="object-contain h-1/4 mx-auto rounded bg-transparent bg-blend-multiply"
                      onDragStart={() => setDragImage(src)}
                    />
                  ))}
              </div>
            </>
          )}
        </div>
        <div className="preview w-4/5 border-2 rounded-md border-gray-400">
          <h3 className="font-semibold h-1/12 text-lg text-gray-700 mt-2">
            Canvas Area
          </h3>
          <div
            className="droparea mx-auto h-10/12 w-11/12 font-semibold text-gray-400 bg-slate-100 flex flex-wrap items-center justify-center border-dashed border-2 rounded-md p-4 gap-4"
            onDragOver={(e) => e.preventDefault()} // Allow dropping
            onDrop={(e) => {
              e.preventDefault();
              if (dragImage) {
                setDragAreaImages((prev) => [...prev, dragImage]);
                setDragImage("");
              }
            }}
          >
            {dragAreaImages.length > 0 ? (
              dragAreaImages.map((src, index) => (
                <Image
                  key={index}
                  src={src}
                  alt={`Dropped item ${index + 1}`}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              ))
            ) : (
              <span>Drag & Drop the props here</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
