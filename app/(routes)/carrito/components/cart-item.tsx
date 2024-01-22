"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { Minus, Plus, X } from "lucide-react";

import IconButton from "@/components/ui/icon-button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { Product } from "@/types";
import Button from "@/components/ui/button";
import { useState } from "react";

interface CartItemProps {
    data: Product;
};

const CartItem: React.FC<CartItemProps> = ({
    data
}) => {

    const cart = useCart();
    const [quantity, setQuantity] = useState(data.selectedQuantity);
    data.selectedQuantity = quantity;

    const onRemove = () => {
        cart.removeItem(data.id);
    }

    const incrementQuantity = () => {
        if (data.quantity > quantity) {
            setQuantity(quantity + 1);
            data.selectedQuantity = quantity;
            cart.editItem(data, data.id);
        }
    }

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
            data.selectedQuantity = quantity;
            cart.editItem(data, data.id);
        }
    }

    return (
        <li className="flex py-6 border-b">
            <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48">
                <Image
                    fill
                    src={data.images[0].url}
                    alt="Imágen del producto"
                    className="object-cover object-center"
                />
            </div>

            <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                <div className="absolute z-10 right-0 top-0">
                    <IconButton onClick={onRemove} icon={<X size={15} />} />
                </div>
                <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div className="flex justify-between">
                        <p className="text-lg font-semibold text-black">
                            {data.name}
                        </p>
                    </div>

                    <div className="mt-1 flex text-sm">
                        <p className="text-gray-500">
                            {
                                // @ts-ignore
                                data.color.name
                            }
                        </p>
                        <p className="text-gray-500 ml-4 border-l border-gray-200 pl-4 ">{data.size.name}</p>
                    </div>
                    <Currency value={data.price} />
                </div>
                {/* Quantity selector */}
                <div className="flex">
                    <Button onClick={() => decrementQuantity()} className="flex items-center rounded-full bg-black px-4 py-2">
                        <Minus
                            size={20}
                            color="white"
                        />
                    </Button>
                    <div className="flex justify-center w-full">
                        <p className="text-xl">Cantidad: {quantity}</p>
                    </div>
                    <Button onClick={() => incrementQuantity()} className="flex items-center rounded-full bg-black px-4 py-2">
                        <Plus
                            size={20}
                            color="white"
                        />
                    </Button>
                </div>
            </div>
        </li>
    );
}

export default CartItem;