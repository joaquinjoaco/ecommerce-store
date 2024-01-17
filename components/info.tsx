"use client";
import { ShoppingCart } from "lucide-react";

import { Product } from "@/types";
import Currency from "@/components/ui/currency";
import Button from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import ProductDescription from "./product-description";

interface InfoProps {
    data: Product
}

const Info: React.FC<InfoProps> = ({
    data
}) => {

    const cart = useCart();

    const onAddToCart = () => {
        cart.addItem(data);
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
            <div className="mt-3 flex items-end justify-between">
                <p className="text-2xl text-gray-900">
                    <Currency value={data?.price} />
                </p>
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
            <div className="mt-10 flex items-center gap-x-3">
                <Button onClick={onAddToCart} className="flex items-center gap-x-2">
                    Añadir al carro
                    <ShoppingCart />
                </Button>

            </div>

        </div>
    );
}



export default Info;