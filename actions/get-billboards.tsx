// Get all billboards.
import { Billboard } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/carteleras`;

const getBillboards = async (): Promise<Billboard[]> => {
    try {
        const res = await fetch(URL);
        return res.json();
    } catch (error) {
        throw new Error("Failed to fetch billboards.");
    }
};

export default getBillboards;