import { resClientError, resNotAllowed, resServerError, resSuccess } from "@/helper/response";
import { editAdminName, editAdminPassword, getAdminById, } from "@/models/admin";
import bcrypt from "bcrypt";
import adminAuth from "@/middleware/adminAuth";

async function handler(req, res) {
    const { adminId } = req.decoded
    try {
        if (req.method === 'GET') {
            const admin = await getAdminById(adminId)
            if (!admin) {
                return res.status(400).json(resClientError('Data Tidak Ditemukan'));
            }
            delete admin.password
            delete admin.refreshToken
            return res.status(200).json(resSuccess("Data Profile", admin));
        }
        if (req.method === 'PUT') {
            const { name, password } = req.body
            if (!name || !password) {
                return res.status(400).json(resClientError('Nama dan Password harus diisi'));
            }
            const admin = await getAdminById(adminId)
            if (!admin) {
                return res.status(400).json(resClientError('Data Tidak Ditemukan'));
            }
            const check = await bcrypt.compare(password, admin.password)
            if (!check) {
                return res.status(400).json(resClientError('Password salah'));
            }
            const update = await editAdminName(adminId, name)
            delete update.password
            delete update.refreshToken
            return res.status(200).json(resSuccess("Update Data Profile Berhasil", update));
        }
        if (req.method === 'PATCH') {
            const { oldPassword, newPassword } = req.body
            if (!oldPassword || !newPassword) {
                return res.status(400).json(resClientError('Password lama dan password baru harus diisi'));
            }
            const admin = await getAdminById(adminId)
            if (!admin) {
                return res.status(400).json(resClientError('Data Tidak Ditemukan'));
            }
            const check = await bcrypt.compare(oldPassword, admin.password)
            if (!check) {
                return res.status(400).json(resClientError('Password lama salah'));
            }
            const hash = await bcrypt.hash(newPassword, 10)
            const update = await editAdminPassword(adminId, hash)
            delete update.password
            delete update.refreshToken
            return res.status(200).json(resSuccess("Update Password Berhasil", update));
        }

        return res.status(405).json(resNotAllowed());
    } catch (error) {
        console.log(error)
        return res.status(500).json(resServerError());
    }
}

export default adminAuth(handler)