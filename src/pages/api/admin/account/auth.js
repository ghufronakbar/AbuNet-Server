import { resServerError, resSuccess, resUnauthorized } from '@/helper/response';
import adminAuth from '@/middleware/adminAuth';

async function handler(req, res) {
    try {        
        return res.status(200).json(resSuccess("Auth Berhasil"));
    } catch (error) {
        return res.status(500).json(resServerError());
    }
}

export default adminAuth(handler)