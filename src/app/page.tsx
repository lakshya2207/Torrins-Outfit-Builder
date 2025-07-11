"use client";

import React, { useState, useRef, useCallback } from "react";
import { IoClose, IoShirtOutline } from "react-icons/io5";
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
import products from "@/data/sampleData";
import {  MdOutlineScreenshotMonitor } from "react-icons/md";
import { MdAddShoppingCart } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import CartDrawer from "@/components/CartDrawer";
import { toast } from "sonner"; // make sure this import is present
import { Toaster } from "@/components/ui/sonner";

type ImageCategories = {
  accessories: string[];
  tops: string[];
  bottoms: string[];
  shoes: string[];
};
type ImageCategoryKey = keyof ImageCategories;

const Page = () => {
  const [dragProductId, setDragProductId] = useState("");
  const [selectedProp, setSelectedProp] = useState<ImageCategoryKey | "">("");
  const [dragAreaProducts, setDragAreaProducts] = useState<
    Array<{
      prid: string;
      imgurl: string;
      name: string;
      price: number;
    }>
  >([]);
  const [cartProducts, setCartProducts] = useState<
    Array<{
      prid: string;
      imgurl: string;
      name: string;
      price: number;
      quantity: number;
    }>
  >([]);
  const [zIndices, setZIndices] = useState<Record<string, number>>({});
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  // const [layers, setlayers] = useState([1, 2, 3]);
  // const [selectedLayer, setSelectedLayer] = useState(1);
  // const [zoomModalOpen, setZoomModalOpen] = useState(false);
  // const [selectedProductForZoom, setSelectedProductForZoom] = useState<{
  //   prid: string;
  //   imgurl: string;
  //   name: string;
  //   scale: number;
  // } | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Filter products by type
  const getProductsByType = (type: string) => {
    return products.filter((product) => product.type === type);
  };

  // Bring product to front
  const bringToFront = useCallback((prid: string) => {
    setZIndices((prev) => {
      const maxZ =
        Object.values(prev).length > 0 ? Math.max(...Object.values(prev)) : 0;
      if (prev[prid] === maxZ) return prev; // Already on top
      console.log(`Bringing ${prid} to front. Current max z-index: ${maxZ}`);
      return { ...prev, [prid]: maxZ + 1 };
    });
  }, []);

  const handleSelect = (prop: ImageCategoryKey | "") => {
    setSelectedProp(prop);
  };

  const handleRemoveImage = (index: number) => {
    setDragAreaProducts((prev) => {
      const newProducts = prev.filter((ele, i) => index != i);
      // Update zIndices to remove the deleted product
      const productToRemove = prev[index];
      if (productToRemove) {
        setZIndices((prevZ) => {
          const newZ = { ...prevZ };
          delete newZ[productToRemove.prid];
          return newZ;
        });
      }
      return newProducts;
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (dragProductId) {
      const product = products.find((p) => p.prid === dragProductId);
      if (product) {
        setDragAreaProducts((prev) => {
          // Check if product already exists in drag area
          const productExists = prev.some(
            (existingProduct) => existingProduct.prid === product.prid
          );
          if (productExists) {
            return prev; // Don't add if already exists
          }

          // Add new item and initialize its z-index
          console.log(`Adding new product: ${product.prid}`);
          const newProduct = {
            prid: product.prid,
            imgurl: product.imgurl,
            name: product.name,
            price: product.price || 1,
          };

          // Initialize z-index for the new product
          setZIndices((prevZ) => {
            const maxZ =
              Object.values(prevZ).length > 0
                ? Math.max(...Object.values(prevZ))
                : 0;
            return { ...prevZ, [product.prid]: maxZ + 1 };
          });

          return [...prev, newProduct];
        });
        setDragProductId("");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleReset = () => {
    setDragAreaProducts([]);
  };

  const handleAddDragProductsToCart = () => {
    if (dragAreaProducts.length === 0) {
      toast.warning("No products in the canvas area");
      return;
    }
    setCartOpen(true);
    // Add quantity to each product when copying to cart
    const productsWithQuantity = dragAreaProducts.map((product) => ({
      ...product,
      quantity: 1,
    }));
    setCartProducts(productsWithQuantity);
  };

  const handleRemoveFromCart = (prid: string) => {
    setCartProducts((prev) => prev.filter((product) => product.prid !== prid));
  };

  const handleUpdateQuantity = (prid: string, quantity: number) => {
    setCartProducts((prev) =>
      prev.map((product) =>
        product.prid === prid ? { ...product, quantity } : product
      )
    );
  };

  const handleAddProductToCart = (product: any) => {
    // Check if product already exists in cart
    const existingProduct = cartProducts.find(p => p.prid === product.prid);
    
    if (existingProduct) {
      // If product exists, increase quantity
      setCartProducts((prev) =>
        prev.map((p) =>
          p.prid === product.prid ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
      toast.success(`${product.name} quantity increased in cart`);
    } else {
      // If product doesn't exist, add it with quantity 1
      const newProduct = {
        prid: product.prid,
        imgurl: product.imgurl,
        name: product.name,
        price: product.price || 1,
        quantity: 1,
      };
      setCartProducts((prev) => [...prev, newProduct]);
      toast.success(`${product.name} added to cart`);
    }
  };

  const takeScreenshot = async () => {
    if (dragAreaProducts.length === 0) {
      toast.warning("No products in the canvas area");
      return;
    }
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
    <div className="main h-svh w-screen flex items-center justify-around flex-col bg-gray-100 text-center relative">
      {/* Cart Button at Top Right */}
      <div className="absolute top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          className="relative"
          onClick={() => setCartOpen(true)}
        >
          <FaShoppingCart className="h-5 w-5" />
          {cartProducts.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartProducts.length}
            </span>
          )}
        </Button>
      </div>
      <h1 className="font-bold text-4xl h-1/12 ">Outfit Builder</h1>

      <div className="box flex flex-col bg-white justify-around rounded-4xl inset-shadow-sm/10 gap-2 h-10/12 md:w-10/12">
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
                <div className="grid grid-cols-1 overflow-y-scroll gap-2">
                  {selectedProp &&
                    getProductsByType(selectedProp).map((product) => (
                      <div
                        key={product.prid}
                        className="relative flex flex-col items-center justify-center h-full mx-auto w-5/6 p-1 rounded shadow-md"
                      >
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="absolute top-1 right-1 p-1 z-10 bg-white hover:bg-gray-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddProductToCart(product);
                            }}
                          >
                            <MdAddShoppingCart size={12}/> 
                          </Button>
                        <Image
                          src={product.imgurl}
                          alt={product.name}
                          width={35}
                          height={35}
                          className="object-contain  mb-1"
                          onDragStart={() => setDragProductId(product.prid)}
                        />
                        <div className="text-xs text-center">
                          <div className="font-semibold truncate">
                            {product.name}
                          </div>
                          <div className="text-gray-600">₹{product.price}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
          <div className="preview w-4/5 h-full border-l-2">
            <h3 className="font-semibold h-1/12 text-lg text-gray-700 mt-2">
              Canvas Area
            </h3>
            <div
              ref={canvasRef}
              className="flex h-10/12 w-11/12 mx-auto font-semibold text-gray-400 bg-white border-dashed border-2 rounded-md droparea relative p-4 overflow-auto"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="w-full h-full relative">
                {dragAreaProducts.length > 0 ? (
                  dragAreaProducts.map((product, index) => (
                    <motion.div
                      key={product.prid}
                      drag
                      dragConstraints={canvasRef}
                      className={`absolute cursor-${
                        draggingIndex === index ? "grabbing" : "grab"
                      } resize overflow-hidden border border-gray-300 bg-white`}
                      onDragStart={() => {
                        setDraggingIndex(index);
                        bringToFront(product.prid);
                      }}
                      onMouseDown={() => {
                        bringToFront(product.prid);
                      }}
                      onDragEnd={() => {
                        setDraggingIndex(null);
                      }}
                      style={{
                        zIndex: zIndices[product.prid],
                        width: 150,
                        height: 150,
                        resize: "both",
                        overflow: "hidden",
                        position: "relative", // ensures absolute children are scoped here
                      }}
                    >
                      {/* Close Button */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute -top-2 -right-2 z-[9999]" // Max z-index locally
                        onClick={() => handleRemoveImage(index)}
                      >
                        <IoClose />
                      </Button>

                      {/* Image */}
                      <Image
                        src={product.imgurl}
                        alt={`Dropped item ${index + 1}`}
                        fill
                        className="object-cover select-none pointer-events-none z-0 "
                        draggable={false}
                        style={{
                          imageRendering: "auto",
                        }}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full w-full text-xs text-center">
                    <span>Select the props from menu at the left side</span>
                    <span>Drag & Drop the props here</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="section2 w-full h-2/12 items-center justify-around flex origin-bottom">
          <Button
            variant="outline"
            className="w-1/6 mx-2"
            onClick={handleReset}
          >
            Reset
          </Button>
          <div className="w-4/5 flex justify-around">
            <Button
              variant="outline"
              className="w-5/12"
              onClick={takeScreenshot}
            >
              <MdOutlineScreenshotMonitor />
              SaveOutfit
            </Button>
            <Button
              variant="outline"
              onClick={handleAddDragProductsToCart}
              className="w-5/12"
            >
              <FaShoppingCart />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      <CartDrawer
        products={cartProducts}
        isOpen={cartOpen}
        onOpenChange={setCartOpen}
        onRemoveProduct={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
      />
       <Toaster position="top-right" />
    </div>
  );
};

export default Page;
