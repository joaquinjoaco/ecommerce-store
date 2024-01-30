// Get a single category.

import { Category } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/categorias`;

const getCategory = async (id: string): Promise<Category> => {
    try {
        const res = await fetch(`${URL}/${id}`);
        return res.json();
    } catch (error) {
        throw new Error("Failed to fetch category.");
    }
};

export default getCategory;