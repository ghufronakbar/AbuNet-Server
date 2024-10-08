import { resClientError, resNotAllowed, resNotFound, resServerError, resSuccess } from "@/helper/response";
import adminAuth from "@/middleware/adminAuth";
import { deleteCoverage, getCoverageById, editCoverage } from "@/models/coverage";
async function handler(req, res) {
    const { id } = req.query;
    try {
        if (req.method === 'GET') {
            const coverage = await getCoverageById(id);
            if (!coverage) return res.status(404).json(resNotFounda());
            return res.status(200).json(resSuccess("Data Cakupan", coverage));
        }

        if (req.method === 'PUT') {
            const { location } = req.body;
            if (!location) {
                return res.status(400).json(resClientError('Data harus diisi'));
            }
            const coverage = await getCoverageById(id);
            if (!coverage) return res.status(404).json(resNotFound());
            const edited = await editCoverage(id, location);
            return res.status(200).json(resSuccess("Berhasil mengedit cakupan", edited));
        }

        if (req.method === 'DELETE') {
            const coverage = await getCoverageById(id);
            if (!coverage) return res.status(404).json(resNotFound());
            await deleteCoverage(id);
            return res.status(200).json(resSuccess("Berhasil menghapus cakupan", coverage));
        }

        return res.status(405).json(resNotAllowed());
    } catch (error) {
        console.log(error);
        return res.status(500).json(resServerError());
    }
}

export default adminAuth(handler);
