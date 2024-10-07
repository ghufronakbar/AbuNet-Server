import { resClientError, resNotAllowed, resServerError, resSuccess } from "@/helper/response";
import bcrypt from "bcrypt";
import userAuth from "@/middleware/userAuth";
import { editPasswordUser, editProfileUser, getUserByEmail, getUserById } from "@/models/user";

async function handler(req, res) {
    const { userId } = req.decoded
    try {
        if (req.method === 'GET') {
            const user = await getUserById(userId)
            if (!user) {
                return res.status(400).json(resClientError('Data Tidak Ditemukan'));
            }
            delete user.password
            delete user.refreshToken
            return res.status(200).json(resSuccess("Data Profile", user));
        }
        if (req.method === 'PUT') {
            const { name, email, phone, address, } = req.body
            if (!name || !email || !phone || !address) {
                return res.status(400).json(resClientError('Semua data harus diisi'));
            }
            const [user, userByEmail] = await Promise.all([getUserById(userId), getUserByEmail(email)])
            if (!user) {
                return res.status(400).json(resClientError('Data Tidak Ditemukan'));
            }

            if (userByEmail && userByEmail.userId !== userId) {
                return res.status(400).json(resClientError('Email sudah terdaftar'));
            }

            const update = await editProfileUser(userId, name, email, phone, address)
            delete update.password
            delete update.refreshToken
            return res.status(200).json(resSuccess("Update Data Profile Berhasil", update));
        }
        if (req.method === 'PATCH') {
            const { oldPassword, newPassword } = req.body
            if (!oldPassword || !newPassword) {
                return res.status(400).json(resClientError('Password lama dan password baru harus diisi'));
            }
            const user = await getUserById(userId)
            if (!user) {
                return res.status(400).json(resClientError('Data Tidak Ditemukan'));
            }
            const check = await bcrypt.compare(oldPassword, user.password)
            if (!check) {
                return res.status(400).json(resClientError('Password lama salah'));
            }
            const hash = await bcrypt.hash(newPassword, 10)
            const update = await editPasswordUser(userId, hash)
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

export default userAuth(handler)