import { resClientError, resNotAllowed, resServerError, resSuccess } from "@/helper/response";
import adminAuth from "@/middleware/adminAuth";
import { createCoverage, getAllCoverages } from "@/models/coverage";
async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const coverages = await getAllCoverages();
            return res.status(200).json(resSuccess("Data cakupan wilayah", coverages));
        }

        if (req.method === 'POST') {
            const { location } = req.body;
            if (!location) {
                return res.status(400).json(resClientError('Data harus diisi'));
            }
            const coverage = await createCoverage(location);
            return res.status(200).json(resSuccess("Berhasil menambahkan cakupan", coverage));
        }

        return res.status(405).json(resNotAllowed());
    } catch (error) {
        console.log(error);
        return res.status(500).json(resServerError());
    }
}

export default adminAuth(handler);
