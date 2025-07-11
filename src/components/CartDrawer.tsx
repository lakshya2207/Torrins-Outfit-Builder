"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ShoppingCart } from "lucide-react";
import { MdDelete } from "react-icons/md";
import { IoAdd, IoRemove } from "react-icons/io5";

interface CartProduct {
  prid: string;
  imgurl: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartDrawerProps {
  products: CartProduct[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRemoveProduct: (prid: string) => void;
  onUpdateQuantity: (prid: string, quantity: number) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
  products,
  isOpen,
  onOpenChange,
  onRemoveProduct,
  onUpdateQuantity,
}) => {
  const totalPrice = products.reduce(
    (sum, product) => sum + (product.price * product.quantity),
    0
  );
  
  const handleRemoveCart = (prid: string) => {
    onRemoveProduct(prid);
  };

  const handleIncreaseQuantity = (prid: string, currentQuantity: number) => {
    onUpdateQuantity(prid, currentQuantity + 1);
  };

  const handleDecreaseQuantity = (prid: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      onUpdateQuantity(prid, currentQuantity - 1);
    } else {
      onRemoveProduct(prid);
    }
  };
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} direction="right">
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Shopping Cart
            </DrawerTitle>
            <DrawerDescription>
              Your selected outfit items ({products.length} items)
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            {products.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Your cart is empty</p>
                <p className="text-sm">Add some items to your outfit first!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product, index) => (
                  <div
                    key={`${product.prid}-${index}`}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                      <Image
                        src={product.imgurl}
                        alt={product.name}
                        fill
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{product.name}</h4>
                      <p className="text-sm font-medium">₹{product.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleDecreaseQuantity(product.prid, product.quantity)}
                        >
                          <IoRemove className="h-4 w-4" />
                        </Button>
                        <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                          {product.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleIncreaseQuantity(product.prid, product.quantity)}
                        >
                          <IoAdd className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant={"outline"}
                        size="sm"
                        onClick={() => handleRemoveCart(product.prid)}
                      >
                        <MdDelete />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DrawerFooter>
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold">₹{totalPrice}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                Continue Shopping
              </Button>
              <Button className="flex-1" disabled={products.length === 0}>
                Checkout
              </Button>
            </div>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
