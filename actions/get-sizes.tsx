// Get all sizes.
import { Size } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/talles`;

const getSizes = async (): Promise<Size[]> => {
    try {
        const res = await fetch(URL);
        return res.json();
    } catch (error) {
        throw new Error("Failed to fetch sizes.");
    }
};

export default getSizes;