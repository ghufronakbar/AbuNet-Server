import { resClientError, resNotAllowed, resNotFound, resServerError, resSuccess } from "@/helper/response";
import adminAuth from "@/middleware/adminAuth";
import { getPackageById, deletePackage, setActive, editPackage } from "@/models/package";
import { createManySpecification, deleteManySpecification } from "@/models/spesification";
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

        if (req.method === 'PUT') {
            const { name, description, installationCost, price, specifications } = req.body

            if (!name || !description || !installationCost || !price || !specifications) {
                return res.status(400).json(resClientError('Semua field harus diisi'))
            }
            if (isNaN(Number(installationCost)) || isNaN(Number(price))) {
                return res.status(400).json(resClientError('Harga harus berupa angka'))
            }
            if (typeof specifications !== 'object') {
                return res.status(400).json(resClientError('Spesifikasi harus berupa {spec:string}[]'))
            }
            if (!Array.isArray(specifications)) {
                return res.status(400).json(resClientError('Spesifikasi harus berupa {spec:string}[]'))
            }
            if (!specifications.length) {
                return res.status(400).json(resClientError('Harus ada minimal 1 spesifikasi'))
            }
            if (Array.isArray(specifications)) {
                for (let i = 0; i < specifications.length; i++) {
                    if (typeof specifications[i] !== 'object' ||
                        !specifications[i].hasOwnProperty('spec') ||
                        typeof specifications[i].spec !== 'string' ||
                        Object.keys(specifications[i]).length !== 1) {
                        return res.status(400).json(resClientError('Spesifikasi harus berupa {spec:string}[]'))
                    }
                }
            }

            for (const spec of specifications) {
                spec.packageId = id
            }

            const packages = await getPackageById(id);
            if (!packages) return res.status(404).json(resNotFound());

            await Promise.all([deleteManySpecification(id), createManySpecification(specifications), editPackage(id, name, description, installationCost, price)]);

            return res.status(200).json(resSuccess("Berhasil mengedit paket"));
        }

        return res.status(405).json(resNotAllowed());
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json(resServerError());
    }
}

export default adminAuth(handler);
