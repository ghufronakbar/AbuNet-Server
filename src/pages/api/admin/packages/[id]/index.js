import { resClientError, resNotAllowed, resNotFound, resServerError, resSuccess } from "@/helper/response";
import adminAuth from "@/middleware/adminAuth";
import { getPackageById, deletePackage, setActive } from "@/models/package";
import removeCloudinary from "@/utils/cloudinary/removeCloudinary";

async function handler(req, res) {
    const { id } = req.query;

    if (!id) return res.status(400).json(resClientError('ID harus diisi'));

    try {
        if (req.method === 'GET') {
            const packages = await getPackageById(id);
            if (!packages) return res.status(404).json(resNotFound());
            return res.status(200).json(resSuccess("Data Paket", packages));
        }

        if (req.method === 'PATCH') {
            const { isActive } = req.body
            if (typeof isActive !== 'boolean') return res.status(400).json(resClientError('isActive harus berupa boolean'));
            const packages = await getPackageById(id);
            if (!packages) return res.status(404).json(resNotFound());
            const edited = await setActive(id, isActive);
            return res.status(200).json(resSuccess(isActive ? "Berhasil mengaktifkan paket" : "Berhasil menonaktifkan paket", edited));
        }

        if (req.method === 'DELETE') {
            const packages = await getPackageById(id);
            if (!packages) return res.status(404).json(resNotFound());
            if (packages.image) {
                await removeCloudinary(packages.image, 'package');
            }
            await deletePackage(id);
            return res.status(200).json(resSuccess("Berhasil menghapus paket", packages));
        }

        return res.status(405).json(resNotAllowed());
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json(resServerError());
    }
}

export default adminAuth(handler);
