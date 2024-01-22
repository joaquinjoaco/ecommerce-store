"use client";
import { Minus, Plus, ShoppingCart } from "lucide-react";

import { Product } from "@/types";
import Currency from "@/components/ui/currency";
import Button from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import ProductDescription from "./ui/product-description";
import { useState } from "react";

export const revalidate = 60;


interface InfoProps {
    data: Product;
}

const Info: React.FC<InfoProps> = ({
    data
}) => {

    const cart = useCart();
    const [quantity, setQuantity] = useState(1);
    data.selectedQuantity = quantity; // updates along with the state above.

    const onAddToCart = () => {
        cart.addItem(data);
    }

    const incrementQuantity = () => {
        if (data.quantity > quantity) {
            setQuantity(quantity + 1);
        }
    }

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
            {data.quantity === 0 && <p className="text-red-400">No hay stock disponible</p>}
            {data.quantity > 0 && <p>{data?.quantity} disponibles</p>}

            <div className="mt-3 flex items-end justify-between">
                <Currency className="text-2xl text-gray-900" value={data?.price} />
            </div>
            <hr className="my-4" />
            <div className="flex flex-col gap-y-6">
                <div className="flex items-center gap-x-4">
                    <h3 className="font-semibold text-black">Talle:</h3>
                    <div>
                        {data?.size?.name}
                    </div>
                </div>
                <div className="flex items-center gap-x-4">
                    <h3 className="font-semibold text-black">Color:</h3>
                    <div
                        className="h-6 w-6 rounded-full border"
                        // @ts-ignore (Property 'value' does not exist on type 'ColorGamut'). idk man
                        style={{ backgroundColor: data?.color?.value }}
                    />
                </div>
            </div>
            {/* description */}
            <div className="flex flex-col my-6">
                <div className="flex items-center">
                    <ProductDescription description={data?.description} />
                </div>
            </div>

            <div className="mt-10 flex flex-col justify-center gap-y-3">
                {/* Quantity selector */}
                <div className="flex">
                    <Button disabled={data.quantity === 0} onClick={() => decrementQuantity()} className="flex items-center rounded-full bg-black px-4 py-2">
                        <Minus
                            size={20}
                            color="white"
                        />
                    </Button>
                    <div className="flex justify-center w-full">
                        <p className="text-xl">Cantidad: {quantity}</p>
                    </div>
                    <Button disabled={data.quantity === 0} onClick={() => incrementQuantity()} className="flex items-center rounded-full bg-black px-4 py-2">
                        <Plus
                            size={20}
                            color="white"
                        />
                    </Button>
                </div>
                <Button disabled={data.quantity === 0} onClick={onAddToCart} className="flex justify-center gap-x-2">
                    Añadir al carro
                    <ShoppingCart />
                </Button>

            </div>

        </div>
    );
}



export default Info;