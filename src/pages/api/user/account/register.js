import { resClientError, resNotAllowed, resServerError, resSuccess } from "@/helper/response";
import { getUserByEmail, registerUser } from "@/models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET } from "@/constant";

async function handler(req, res) {
    try {

        if (req.method === 'POST') {
            const { name, email, password } = req.body
            if (!name || !email || !password) {
                return res.status(400).json(resClientError('Data harus diisi'));
            }
            const user = await getUserByEmail(email)

            if (user) {
                return res.status(400).json(resClientError('Email sudah terdaftar'));
            }

            const hash = await bcrypt.hash(password, 10)
            const newUser = await registerUser(name, email, hash)
            delete newUser.password
            delete newUser.refreshToken

            return res.status(200).json(resSuccess("Register Berhasil", newUser));
        }

        return res.status(405).json(resNotAllowed());
    } catch (error) {
        console.log(error)
        return res.status(500).json(resServerError());
    }
}

export default handler