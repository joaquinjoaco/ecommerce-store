// Get all products.
import { Product } from "@/types";
import qs from "query-string";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/productos`;

interface Query {
    categoryId?: string;
    colorId?: string;
    sizeId?: string;
    isFeatured?: boolean;
}

const getProducts = async (query: Query): Promise<Product[]> => {
    try {
        const url = qs.stringifyUrl({
            url: URL,
            query: {
                colorId: query.colorId,
                sizeId: query.sizeId,
                categoryId: query.categoryId,
                isFeatured: query.isFeatured,
            }
        });
        const res = await fetch(url);
        return res.json();
    } catch (error) {
        throw new Error("Failed to fetch Products.");
    }
};

export default getProducts;