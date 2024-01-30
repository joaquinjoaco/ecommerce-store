// Get all colors.
import { Color } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/colores`;

const getColors = async (): Promise<Color[]> => {
    try {
        const res = await fetch(URL);
        return res.json();
    } catch (error) {
        throw new Error("Failed to fetch colors.");
    }
};

export default getColors;