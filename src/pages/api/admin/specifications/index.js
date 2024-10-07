import { resClientError, resNotAllowed, resNotFound, resServerError, resSuccess } from "@/helper/response";
import adminAuth from "@/middleware/adminAuth";
import { createSpecification } from "@/models/spesification";
import { getPackageById } from "@/models/package";

async function handler(req, res) {
    try {
        if (req.method === 'POST') {
            const { spec, packageId } = req.body;
            if (!spec) return res.status(400).json(resClientError('Spesifikasi harus diisi'));
            if (!packageId) return res.status(400).json(resClientError('ID Paket harus diisi'));

            const packages = await getPackageById(packageId);
            if (!packages) return res.status(404).json(resNotFound());

            const specification = await createSpecification(packageId, spec.toString());
            return res.status(200).json(resSuccess("Berhasil menambahkan spesifikasi", specification));
        }

        return res.status(405).json(resNotAllowed());
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json(resServerError());
    }
}

export default adminAuth(handler);
