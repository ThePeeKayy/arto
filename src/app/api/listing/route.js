import { fetchProducts } from "../../../../utils/database";

export const POST = async (req,res) => {
    const {query, category} = await req.json()
    try {
        const products = await fetchProducts(query,category);
        const newResponse = new Response(JSON.stringify(products));
        return newResponse;
    } catch(error) {
        console.error(error);
        return new Response({ error: 'Internal Server Error' });
    }
}