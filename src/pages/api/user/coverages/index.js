import { resClientError, resNotAllowed, resServerError, resSuccess } from "@/helper/response";
import userAuth from "@/middleware/userAuth";
import { getAllCoverages, } from "@/models/coverage";
async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const coverages = await getAllCoverages();
            return res.status(200).json(resSuccess("Data cakupan wilayah", coverages));
        }

        return res.status(405).json(resNotAllowed());
    } catch (error) {
        console.log(error);
        return res.status(500).json(resServerError());
    }
}

export default userAuth(handler);
