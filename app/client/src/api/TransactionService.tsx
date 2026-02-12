import axios from "axios";
import { BASE_URL } from "@/utils/constants";
import type { Transaction } from "@/types/Transaction";
async function getTransactions(): Promise<Transaction[]> {
    try {
        const response = await axios.get(`${BASE_URL}/api/transactions`);
        if (response.status !== 200) {
            throw new Error(`Failed to fetch transactions: ${response.statusText}`);
        }
        return response.data;
    } catch (error) {
        console.error("Error fetching transactions:", error);
        throw error;
    }
}
export default {
    getTransactions,
};