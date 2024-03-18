import { fetchProduct,deleteListing,editListing,getUserByName } from "../../../../../utils/database";

export const GET = async (req, {params}) => {
    try {
        const product = await fetchProduct(params.id);
        const newResponse = new Response(JSON.stringify(product));
        return newResponse;
    } catch(error) {
        console.error(error);
        return new Response({ error: 'Internal Server Error' });
    }
}

export const POST = async (req,res) => {
    const {name} = await req.json()
    try {
        const results = await getUserByName(name)
        const newResponse = new Response(JSON.stringify(results))
        return newResponse
    } catch(error) {
        console.error(error);
        return new Response({ error: 'Internal Server Error' });
    }
}

export const PATCH = async (req, {params}) => {
    const {title,description,price,category,imgUrls,username,qtyavail} = await req.json()
    try {
        await editListing(title,description,price,category,imgUrls,username,params.id,qtyavail);
        return new Response({status:200})
    } catch(error) {
        console.error(error);
        return new Response({ error: 'Internal Server Error' });
    }
}

export const DELETE = async (req, {params}) => {
    try {
        const product = await deleteListing(params.id);
        const newResponse = new Response(JSON.stringify(product));
        return newResponse;
    } catch(error) {
        console.error(error);
        return new Response({ error: 'Internal Server Error' });
    }
}