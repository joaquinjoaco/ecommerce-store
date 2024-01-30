// Get all categories.
import { Category } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/categorias`;

const getCategories = async (): Promise<Category[]> => {
    try {
        const res = await fetch(URL);
        return res.json();
    } catch (error) {
        return [];
    }
};

export default getCategories;