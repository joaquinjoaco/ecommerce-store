"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";

import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";

const Summary = () => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const items = useCart((state) => state.items);
    const removeAll = useCart((state) => state.removeAll);

    // Called by useEffect after successful payment
    const orderSucess = async (orderId: string | null, toastId: string) => {
        if (orderId) {
            try {
                const payment_id = searchParams.get("payment_id");
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout/${orderId}?payment_id=${payment_id}`);
                toast.success("Pago verificado.", { id: toastId });
            } catch (error: any) {
                toast.error("Ocurrió un error inesperado en la validación posterior al pago.", { id: toastId });
            }
        }
    }

    useEffect(() => {
        if (searchParams.get("success")) {
            removeAll();
            const toastId = toast.loading("Verificando pago...");
            orderSucess(searchParams.get("order_id"), toastId);
        }

        if (searchParams.get("failure")) {
            toast.error("Ocurrió un error inesperado.");
        }

        if (searchParams.get("pending")) {
            toast.error("El pago se encuentra pendiente. Comunícate con nosotros.");
        }

    }, [searchParams, removeAll]);

    const totalPrice = items.reduce((total, item) => {
        return total + (Number(item.price) * item.selectedQuantity)
    }, 0); // default value 0.

    return (
        <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">
                Resumen de la orden
            </h2>
            <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="text-base font-bold text-gray-900">
                        Subtotal
                    </div>
                    <div className="font-bold">
                        <Currency value={totalPrice} />
                    </div>
                </div>
            </div>
            <Button
                disabled={items.length === 0 || isLoading}
                onClick={() => {
                    setIsLoading(true);
                    router.push("/checkout");
                }}
                className="w-full mt-6">
                {isLoading ? "Cargando..." : "Finalizar compra"}
            </Button>
        </div>
    )
}

export default Summary;