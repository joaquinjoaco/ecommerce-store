"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";

import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";

const Summary = () => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const items = useCart((state) => state.items);
    const removeAll = useCart((state) => state.removeAll);

    // Called by useEffect after successful payment
    const orderSucess = async (orderId: string | null) => {
        if (orderId) {
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout/${orderId}`);
                toast.success("Pago verificado.")
            } catch (error: any) {
                toast.error("Ocurrió un error inesperado en la validación posterior al pago.");
            }
        }
    }

    useEffect(() => {
        if (searchParams.get("success")) {
            toast.success("Pago completado.");
            orderSucess(searchParams.get("order_id"));
            removeAll();
        }

        if (searchParams.get("failure")) {
            toast.error("Ocurrió un error inesperado.");
        }

        if (searchParams.get("pending")) {
            toast.error("El pago se encuentra pendiente.");
        }

    }, [searchParams, removeAll]);

    const totalPrice = items.reduce((total, item) => {
        return total + Number(item.price)
    }, 0); // default value 0.

    // const onCheckout = async () => {
    //     const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
    //         productIds: items.map((item) => item.id),
    //     });

    //     window.location = response.data.url;
    // }

    return (
        <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">
                Resumen de la orden
            </h2>
            <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="text-base font-medium text-gray-900">
                        Total de la orden
                    </div>
                    <div className="font-bold">
                        <Currency value={totalPrice} />
                    </div>
                </div>
            </div>
            <Button disabled={items.length === 0} onClick={() => router.push("/checkout")} className="w-full mt-6">
                Finalizar compra
            </Button>
        </div>
    )
}

export default Summary;