"use client";

import Currency from "@/components/ui/currency";
import { Product } from "@/types";

interface CheckoutItemProps {
    data: Product;
};

const CheckoutItem: React.FC<CheckoutItemProps> = ({
    data
}) => {

    return (
        <li className="flex justify-between">
            {/* Product */}
            <div className="flex flex-col justify-between">
                <p className="text-md font-semibold text-black">
                    {data.selectedQuantity} x {data.name}
                </p>
                <p className="text-gray-500">
                    {
                        // @ts-ignore
                        data.color.name
                    }

                    {data.size.name && `, Talle ${data.size.name}`}
                </p>
            </div>

            {/* Price */}
            <div className="flex mt-1 text-sm">
                <Currency className="text-gray-500 font-bold" value={Number(data.price) * data.selectedQuantity} />
            </div>
        </li >
    );
}

export default CheckoutItem;