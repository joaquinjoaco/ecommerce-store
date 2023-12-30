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
        <li className="flex">
            <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div className="flex flex-col justify-between">
                        <p className="text-md font-semibold text-black">
                            {data.name}
                        </p>
                        <p className="text-gray-500">
                            {
                                // @ts-ignore
                                data.color.name
                            }

                            {data.size.name && `, Talle ${data.size.name}`}
                        </p>
                    </div>

                    <div className="mt-1 flex text-sm">
                        <p className="text-gray-500">
                            <Currency value={data.price} />
                        </p>
                    </div>

                </div>
            </div>
        </li>
    );
}

export default CheckoutItem;