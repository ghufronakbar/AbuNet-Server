import { resClientError, resNotAllowed, resNotFound, resServerError, resSuccess } from "@/helper/response";
import adminAuth from "@/middleware/adminAuth";
import { deleteSpecification, editSpecification, getSpecificationById } from "@/models/spesification";

async function handler(req, res) {
    const { id } = req.query;

    if (!id) return res.status(400).json(resClientError('ID harus diisi'));

    try {
        if (req.method === 'GET') {
            const specification = await getSpecificationById(id);
            if (!specification) return res.status(404).json(resNotFound());
            return res.status(200).json(resSuccess("Data Spesifikasi", specification));
        }

        if (req.method === 'PUT') {
            const { spec } = req.body
            if (!spec) return res.status(400).json(resClientError('Spesifikasi harus diisi'))
            const specification = await getSpecificationById(id);
            if (!specification) return res.status(404).json(resNotFound());
            await editSpecification(id, spec.toString());
            return res.status(200).json(resSuccess("Berhasil mengedit spesifikasi", specification));
        }

        if (req.method === 'DELETE') {
            const spec = await getSpecificationById(id);
            if (!spec) return res.status(404).json(resNotFound());
            await deleteSpecification(id);
            return res.status(200).json(resSuccess("Berhasil menghapus spesifikasi", spec));
        }

        return res.status(405).json(resNotAllowed());
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json(resServerError());
    }
}

export default adminAuth(handler);
