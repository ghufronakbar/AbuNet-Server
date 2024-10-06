import { resClientError, resNotAllowed, resServerError, resSuccess, resUnauthorized } from "@/helper/response";
import { getAdminByRefreshToken } from "@/models/admin";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/constant";

async function handler(req, res) {
    try {
        if (req.method === 'POST') {
            const { refreshToken } = req.body
            if (!refreshToken) {
                return res.status(400).json(resClientError('Refresh Token harus diisi'));
            }
            const admin = await getAdminByRefreshToken(refreshToken)

            if (!admin) {
                return res.status(401).json(resUnauthorized());
            }

            const verify = jwt.verify(refreshToken, JWT_SECRET)

            if (!verify) {
                return res.status(401).json(resUnauthorized());
            }

            const accessToken = jwt.sign({ adminId: admin.adminId }, JWT_SECRET, { expiresIn: '1h' });

            const role = "ADMIN"

            return res.status(200).json(resSuccess("Refresh Berhasil", { accessToken, refreshToken, role }));
        }

        return res.status(405).json(resNotAllowed());
    } catch (error) {
        console.log(error)
        return res.status(500).json(resServerError());
    }
}

export default handler