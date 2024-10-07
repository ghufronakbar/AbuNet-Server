import { resClientError, resNotAllowed, resServerError, resSuccess } from "@/helper/response";
import { getUserByEmail, updateRefreshToken } from "@/models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET } from "@/constant";

async function handler(req, res) {
    try {

        if (req.method === 'POST') {
            const { email, password } = req.body
            if (!email || !password) {
                return res.status(400).json(resClientError('Email dan Password harus diisi'));
            }
            const user = await getUserByEmail(email)

            if (!user) {
                return res.status(400).json(resClientError('Email tidak terdaftar'));
            }

            if (user.isDeleted) {
                return res.status(400).json(resClientError('Akun telah di hapus'));
            }

            const check = await bcrypt.compare(password, user.password);
            if (!check) {
                return res.status(400).json(resClientError('Password salah'));
            }

            const accessToken = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: '1h' });
            const refreshToken = jwt.sign({ userId: user.userId }, JWT_SECRET);
            const role = "USER"
            await updateRefreshToken(user.userId, refreshToken)
            return res.status(200).json(resSuccess("Login Berhasil", { accessToken, refreshToken, role }));
        }

        return res.status(405).json(resNotAllowed());
    } catch (error) {
        console.log(error)
        return res.status(500).json(resServerError());
    }
}

export default handler