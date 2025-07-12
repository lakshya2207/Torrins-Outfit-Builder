"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { IoShirtOutline } from "react-icons/io5";
import { PiPants } from "react-icons/pi";
import { TbShoe } from "react-icons/tb";
import { BsHandbag } from "react-icons/bs";
import { PiBaseballCap } from "react-icons/pi";
import { RiGlassesFill } from "react-icons/ri";
import { PiBelt } from "react-icons/pi";
import { IoIosArrowRoundBack } from "react-icons/io";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas-pro";
import products from "@/data/sampleData";
import { MdOutlineScreenshotMonitor } from "react-icons/md";
import { MdAddShoppingCart } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import CartDrawer from "@/components/CartDrawer";
import { toast } from "sonner"; // make sure this import is present
import { Toaster } from "@/components/ui/sonner";
import ReactFlow, {
  Controls,
  Background,
  Node,
  Edge,
  applyNodeChanges,
  NodeChange,
} from "reactflow";
import "reactflow/dist/style.css";
import ImageNode from "@/components/ImageNode";

const nodeTypes = {
  imageNode: ImageNode,
};
type ImageCategories = {
  accessories: string[];
  tops: string[];
  bottoms: string[];
  shoes: string[];
};
type ImageCategoryKey = keyof ImageCategories;

type Product = {
  prid: string;
  name: string;
  price: number;
  imgurl: string;
  zindex?: number;
  type?: string;
};

const Page = () => {
  const [dragProductId, setDragProductId] = useState("");
  const [selectedProp, setSelectedProp] = useState<ImageCategoryKey | "">("");

  const [cartProducts, setCartProducts] = useState<
    Array<{
      prid: string;
      imgurl: string;
      name: string;
      price: number;
      quantity: number;
    }>
  >([]);

  const [cartOpen, setCartOpen] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Filter products by type
  const getProductsByType = (type: string) => {
    return products.filter((product) => product.type === type);
  };

  // Bring product to front

  const handleSelectProductType = (prop: ImageCategoryKey | "") => {
    setSelectedProp(prop);
  };

  const handleReset = () => {
    setNodes([]);
  };

  const handleAddAllToCart = () => {
    if (nodes.length === 0) {
      toast.warning("No products in the canvas area");
      return;
    }

    setCartOpen(true);

    const nodeIds = nodes.map((node) => node.id);
    const productsToAdd = products.filter((product) =>
      nodeIds.includes(product.prid)
    );

    setCartProducts((prevCart) => {
      const updatedCart = [...prevCart];

      productsToAdd.forEach((product) => {
        const existingProductIndex = updatedCart.findIndex(
          (p) => p.prid === product.prid
        );

        if (existingProductIndex !== -1) {
          // Increment quantity
          updatedCart[existingProductIndex].quantity += 1;
        } else {
          // Add new product with quantity 1
          updatedCart.push({ ...product, quantity: 1 });
        }
      });

      return updatedCart;
    });
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

  const handleAddSingleToCart = (product: Product) => {
    // Check if product already exists in cart
    const existingProduct = cartProducts.find((p) => p.prid === product.prid);

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
    if (nodes.length === 0) {
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

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges] = useState<Edge[]>([]);
  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  useEffect(() => {
    console.log("nodes", nodes);
  }, [nodes]);
  useEffect(() => {
    console.log("dragProductId", dragProductId);
  }, [dragProductId]);
  const handleRemoveNode = (prid: string) => {
    setNodes((prev) => prev.filter((node) => node.id !== prid));
  };
  const handleDrop = (e: React.DragEvent | React.TouchEvent) => {
    e.preventDefault();
    console.log("enteredondrop");
    if (dragProductId) {
      console.log("dragProductId", dragProductId);

      const product = products.find((prod) => prod.prid == dragProductId);
      if (product) {
        const newNode = {
          id: dragProductId,
          type: "imageNode",
          position: { x: 0, y: 0 },
          data: {
            imageURL: product.imgurl,
            deleteNode: handleRemoveNode,
          },
        };
        setNodes((prev) => [...prev, newNode]);
      }
      setDragProductId("");
    }
  };
  const handleTouchEndDrop = (e: React.TouchEvent, productId: string) => {
    const touch = e.changedTouches[0];
    const x = touch.clientX;
    const y = touch.clientY;

    const dropTarget = document.elementFromPoint(x, y);

    if (canvasRef.current?.contains(dropTarget)) {
      setDragProductId(productId); // set the ID being "dropped"

      // Simulate a drop event for handleDrop
      handleDrop(e);
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

      <div className="box flex flex-col bg-white justify-around rounded-4xl inset-shadow-sm/10 gap-2 md:h-10/12 h-11/12 md:w-10/12 w-full">
        <div className="section1 w-full md:h-10/12 h-10/12 flex flex-col-reverse md:flex-row md:justify-around justify-between items-center gap-2 ">
          <div className="sidebar md:w-1/5 w-5/6 md:h-10/12 h-2/12 p-2 flex md:flex-col flex-row text-sm text-gray-700 font-semibold ">
            {selectedProp === "" ? (
              <>
                <Button
                  variant="outline"
                  className="items md:h-1/4 h-full m-1 flex flex-col items-center justify-around rounded-md "
                  onClick={() => handleSelectProductType("accessories")}
                >
                  <div className="grid grid-cols-2 gap-1">
                    <BsHandbag size={18} />
                    <PiBaseballCap size={18} />
                    <RiGlassesFill size={18} />
                    <PiBelt size={18} />
                  </div>
                  Accessories
                </Button>
                <Button
                  variant="outline"
                  className="items  md:h-1/4 h-full m-1 flex flex-col items-center justify-center rounded-md "
                  onClick={() => handleSelectProductType("tops")}
                >
                  <IoShirtOutline size={35} />
                  Tops
                </Button>
                <Button
                  variant="outline"
                  className="items  md:h-1/4 h-full m-1 flex flex-col items-center justify-center rounded-md"
                  onClick={() => handleSelectProductType("bottoms")}
                >
                  <PiPants size={35} />
                  Bottom
                </Button>
                <Button
                  variant="outline"
                  className="items  md:h-1/4 h-full m-1 flex flex-col items-center justify-center rounded-md"
                  onClick={() => handleSelectProductType("shoes")}
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
                  onClick={() => handleSelectProductType("")}
                >
                  <IoIosArrowRoundBack
                    size={30}
                    // className="border-b-1 border-gray-400 z-10 w-full"
                  />
                </Button>
                <div className=" flex md:grid md:grid-cols-1 overflow-y-hidden md:overflow-y-scroll overflow-x-scroll gap-2">
                  {selectedProp &&
                    getProductsByType(selectedProp).map((product) => (
                      <div
                        key={product.prid}
                        className="relative flex flex-col items-center justify-center h-full mx-auto w-5/6 p-1 rounded shadow-md"
                      >
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute top-0 md:top-1 right-0 md:right-1 p-1 z-10 bg-white hover:bg-gray-50 not-md:scale-75"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddSingleToCart(product);
                          }}
                        >
                          <MdAddShoppingCart size={12} />
                        </Button>
                        <Image
                          src={product.imgurl}
                          alt={product.name}
                          width={35}
                          height={35}
                          className="object-contain h-10 w-10 mb-1"
                          onDragStart={() => setDragProductId(product.prid)}
                          onTouchMove={() => setDragProductId(product.prid)}
                          onTouchEnd={(e) =>
                            handleTouchEndDrop(e, product.prid)
                          } // 🧠 new function here
                          onContextMenu={(e) => e.preventDefault()} // 👈 disables right-click / long-press menu
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
          <div className="preview w-4/5 md:h-full h-9/12 md:border-l-2">
            <h3 className="font-semibold h-1/12 text-lg text-gray-700 mt-2">
              Canvas Area
            </h3>
            <ReactFlow
              ref={canvasRef}
              className="mx-auto border-dashed border-2 rounded-md h-10/12 max-h-10/12 max-w-11/12 resize"
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              nodeTypes={nodeTypes}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()} // <== Important!
            >
              <Background />
              <Controls />
            </ReactFlow>
            <p className="font-semibold text-gray-400 text-xs">
              Select and drop the Products from Sidebar to above to
              visualize,rezise it.
              <br />
              To save the Outfit Combination, first resize and centerise the
              canvas area and hit Save Outfit button
            </p>
          </div>
        </div>
        <div className="section2 w-full md:h-2/12 h-2/12 items-center justify-around flex origin-bottom">
          <Button
            variant="outline"
            className="w-1/6 mx-2 not-md:mb-10"
            onClick={handleReset}
          >
            Reset
          </Button>
          <div className="w-4/5 flex justify-around not-md:mb-10">
            <Button
              variant="outline"
              className="w-5/12"
              onClick={takeScreenshot}
            >
              <MdOutlineScreenshotMonitor />
              Save Outfit
            </Button>
            <Button
              variant="outline"
              onClick={handleAddAllToCart}
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
