import { JWT_SECRET } from '@/constant';
import { resUnauthorized } from '@/helper/response';
import jwt from 'jsonwebtoken';

export default function userAuth(handler) {
    return async (req, res) => {
        const { authorization } = req.headers;
        
        if (!authorization) {
            return res.status(401).json(resUnauthorized());
        }
        
        try {
            const token = authorization.split(' ')[1];
            
            if (!token) {
                return res.status(401).json(resUnauthorized());
            }
            
            const decoded = jwt.verify(token, JWT_SECRET);
            
            if (!decoded) {
                return res.status(401).json(resUnauthorized());
            }
            if (!decoded.userId) {                
                return res.status(401).json(resUnauthorized());
            }
            
            req.decoded = decoded;
            return handler(req, res);
        } catch (error) {
            return res.status(401).json(resUnauthorized());
        }
    };
}
