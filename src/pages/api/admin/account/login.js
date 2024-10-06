import { resClientError, resNotAllowed, resServerError, resSuccess } from "@/helper/response";
import { getAdminByEmail, updateRefreshToken } from "@/models/admin";
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
            const admin = await getAdminByEmail(email)

            if (!admin) {
                return res.status(400).json(resClientError('Email tidak terdaftar'));
            }

            const check = await bcrypt.compare(password, admin.password);
            if (!check) {
                return res.status(400).json(resClientError('Password salah'));
            }

            const accessToken = jwt.sign({ adminId: admin.adminId }, JWT_SECRET, { expiresIn: '1h' });
            const refreshToken = jwt.sign({ adminId: admin.adminId }, JWT_SECRET);
            const role = "ADMIN"
            await updateRefreshToken(admin.adminId, refreshToken)
            return res.status(200).json(resSuccess("Login Berhasil", { accessToken, refreshToken, role }));
        }

        return res.status(405).json(resNotAllowed());
    } catch (error) {
        console.log(error)
        return res.status(500).json(resServerError());
    }
}

export default handler