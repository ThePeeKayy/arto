import { createNewListing } from "../../../../../utils/database";

export const POST = async (req, res) => {
    const {title,description,price,category,imgUrls,username,qtyavail} = await req.json();
    try {
        createNewListing(title,description,price,category,imgUrls,username,qtyavail);
        return new Response({status:200})
    } catch(error) {
        console.error(error);
        res.json({ error: 'Internal Server Error' });
    }
}