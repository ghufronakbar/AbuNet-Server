import { resClientError, resNotAllowed, resServerError, resSuccess } from "@/helper/response";
import userAuth from "@/middleware/userAuth";
import { getAllPackages, createPackage, getAllPackagesPopular } from "@/models/package";

async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const isPopular = req.query.query === 'popular' ? true : false
            if (isPopular) {                
                const packages = await getAllPackagesPopular()
                return res.status(200).json(resSuccess("Data Paket", packages));
            } else {                
                const packages = await getAllPackages()
                return res.status(200).json(resSuccess("Data Paket", packages));
            }
        }        

        return res.status(405).json(resNotAllowed());
    } catch (error) {
        console.log(error)
        return res.status(500).json(resServerError());
    }
}

export default userAuth(handler)