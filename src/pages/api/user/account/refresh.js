import { resClientError, resNotAllowed, resServerError, resSuccess, resUnauthorized } from "@/helper/response";
import { getUserByRefreshToken } from "@/models/user";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/constant";

async function handler(req, res) {
    try {
        if (req.method === 'POST') {
            const { refreshToken } = req.body
            if (!refreshToken) {
                return res.status(400).json(resClientError('Refresh Token harus diisi'));
            }
            const user = await getUserByRefreshToken(refreshToken)

            if (!user) {
                return res.status(401).json(resUnauthorized());
            }

            const verify = jwt.verify(refreshToken, JWT_SECRET)

            if (!verify) {
                return res.status(401).json(resUnauthorized());
            }

            const accessToken = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: '1h' });

            const role = "USER"

            return res.status(200).json(resSuccess("Refresh Berhasil", { accessToken, refreshToken, role }));
        }

        return res.status(405).json(resNotAllowed());
    } catch (error) {
        console.log(error)
        return res.status(500).json(resServerError());
    }
}

export default handler