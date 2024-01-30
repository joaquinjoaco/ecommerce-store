// Get a single product.

import { Product } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/productos`;

const getProduct = async (id: string): Promise<Product> => {
    try {
        const res = await fetch(`${URL}/${id}`);
        return res.json();
    } catch (error) {
        throw new Error("Failed to fetch product.");
    }
};

export default getProduct;