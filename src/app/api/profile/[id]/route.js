import { getUserById } from "../../../../../utils/database";

export const GET = async (req,{params}) => {
    try {
        const results = await getUserById(params.id)
        const newResponse = new Response(JSON.stringify(results))
        return newResponse
    } catch(error) {
        console.error(error);
        return new Response({ error: 'Internal Server Error' });
    }
}


