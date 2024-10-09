import { resClientError, resNotAllowed, resServerError, resSuccess } from "@/helper/response";
import adminAuth from "@/middleware/adminAuth";
import { getAllPackages, createPackage } from "@/models/package";

async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const packages = await getAllPackages()
            return res.status(200).json(resSuccess("Data Paket", packages));
        }

        if (req.method === 'POST') {
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

            const packages = await createPackage(name, description, Number(installationCost), "/", Number(price), specifications)

            return res.status(200).json(resSuccess("Data Paket", packages));
        }

        return res.status(405).json(resNotAllowed());
    } catch (error) {
        console.log(error)
        return res.status(500).json(resServerError());
    }
}

export default adminAuth(handler)