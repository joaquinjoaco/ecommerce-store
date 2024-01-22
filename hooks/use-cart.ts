import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import toast from "react-hot-toast";

import { Product } from "@/types";

interface CartStore {
    items: Product[];
    addItem: (data: Product) => void;
    editItem: (newData: Product, id: string) => void;
    removeItem: (id: string) => void;
    removeAll: () => void;
};

const useCart = create(
    persist<CartStore>((set, get) => ({
        items: [],
        addItem: (data: Product) => {
            const currentItems = get().items;
            const existingItem = currentItems.find((item) => item.id === data.id);

            if (existingItem) {
                return toast(`${data.name} ya se encuentra en el carrito.`);
            }

            set({ items: [...get().items, data] });
            toast.success(`${data.name} se añadió al carrito de compras.`);
        },
        editItem: (newData: Product, id: string) => {
            set((cart) => ({
                // if the item.id is the same as the id that it received it will map the newData item to
                // the array instead of the current item in that index.
                items: cart.items.map((item) =>
                    item.id === id ? newData : item
                ),
            }));
            toast.success(`${newData.name} se actualizó en el carrito de compras.`);
        },
        removeItem: (id: string) => {
            set({ items: [...get().items.filter((item) => item.id !== id)] });
            toast.success("Se eliminó el producto del carrito de compras.");
        },
        removeAll: () => set({ items: [] }),
    }), {
        name: "cart-storage",
        storage: createJSONStorage(() => localStorage)
    })
)

export default useCart;