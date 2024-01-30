// Get a single billboard.
import { Billboard } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/carteleras`;

const getBillboard = async (id: string): Promise<Billboard> => {
    try {
        const res = await fetch(`${URL}/${id}`);
        return res.json();
    } catch (error) {
        throw new Error("Failed to fetch billboard.");
    }
};

export default getBillboard;