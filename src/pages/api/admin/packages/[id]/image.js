import { resClientError, resNotAllowed, resNotFound, resServerError, resSuccess } from "@/helper/response";
import adminAuth from "@/middleware/adminAuth";
import { getPackageById, deletePackage, editImagePackage, setActive } from "@/models/package";
import cloudinary from '@/config/cloudinary';
import formidable from 'formidable';
import fs from 'fs';
import { CLOUDINARY_PACKAGE } from "@/constant/cloudinary";
import removeCloudinary from "@/utils/cloudinary/removeCloudinary";

export const config = {
    api: {
        bodyParser: false,
    },
};

async function handler(req, res) {
    const { id } = req.query;

    if (!id) return res.status(400).json(resClientError('ID harus diisi'));

    try {
        if (req.method === 'POST') {
            const packages = await getPackageById(id);
            if (!packages) return res.status(404).json(resNotFound());
            const form = formidable({ multiples: false });
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    console.error('Formidable Error:', err);
                    return res.status(400).json(resClientError('Error saat parsing form data'));
                }

                const file = files.image;
                if (!file) {
                    return res.status(400).json(resClientError('File harus diunggah'));
                }

                const uploadToCloudinary = () => {
                    return new Promise((resolve, reject) => {
                        const uploadStream = cloudinary.uploader.upload_stream(
                            { folder: CLOUDINARY_PACKAGE },
                            (error, result) => {
                                if (error) {
                                    console.error('Cloudinary Error:', error);
                                    reject(error);
                                } else {
                                    resolve(result);
                                }
                            }
                        );

                        const stream = fs.createReadStream(file[0].filepath);
                        stream.pipe(uploadStream);
                    });
                };

                if (packages.image) {
                    removeCloudinary(packages.image, 'package');
                }

                try {
                    const uploadResult = await uploadToCloudinary();
                    console.log({ uploadResult: uploadResult.url });
                    const edited = await editImagePackage(id, uploadResult.url);
                    console.log({ edited });
                    return res.status(200).json(resSuccess("Berhasil mengupload gambar", edited));
                } catch (error) {
                    throw error;
                }
            });
        } else {
            return res.status(405).json(resNotAllowed());
        }
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json(resServerError());
    }
}

export default adminAuth(handler);
