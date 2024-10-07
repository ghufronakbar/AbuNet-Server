import { resClientError, resNotAllowed, resNotFound, resServerError, resSuccess } from "@/helper/response";
import userAuth from "@/middleware/userAuth";
import { getPackageById, } from "@/models/package";

async function handler(req, res) {
    const { id } = req.query;

    if (!id) return res.status(400).json(resClientError('ID harus diisi'));

    try {
        if (req.method === 'GET') {
            const packages = await getPackageById(id);
            if (!packages) return res.status(404).json(resNotFound());
            return res.status(200).json(resSuccess("Data Paket", packages));
        }

        if (req.method === 'PUT') {

        }

        return res.status(405).json(resNotAllowed());
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json(resServerError());
    }
}

export default userAuth(handler);
