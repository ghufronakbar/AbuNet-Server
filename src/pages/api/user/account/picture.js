import { resClientError, resNotAllowed, resNotFound, resServerError, resSuccess } from "@/helper/response";
import cloudinary from '@/config/cloudinary';
import formidable from 'formidable';
import fs from 'fs';
import { CLOUDINARY_PACKAGE, CLOUDINARY_PROFILE } from "@/constant/cloudinary";
import removeCloudinary from "@/utils/cloudinary/removeCloudinary";
import userAuth from "@/middleware/userAuth";
import { editPictureUser, getUserById } from "@/models/user";

export const config = {
    api: {
        bodyParser: false,
    },
};

async function handler(req, res) {
    const { userId } = req.decoded;

    try {
        if (req.method === 'POST') {
            const user = await getUserById(userId);
            if (!user) return res.status(404).json(resNotFound());
            const form = formidable({ multiples: false });
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    console.error('Formidable Error:', err);
                    return res.status(400).json(resClientError('Error saat parsing form data'));
                }

                const file = files.picture;
                if (!file) {
                    return res.status(400).json(resClientError('File harus diunggah'));
                }

                const uploadToCloudinary = () => {
                    return new Promise((resolve, reject) => {
                        const uploadStream = cloudinary.uploader.upload_stream(
                            { folder: CLOUDINARY_PROFILE },
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

                if (user.picture) {
                    await removeCloudinary(user.picture, 'profile');
                }

                try {
                    const uploadResult = await uploadToCloudinary();
                    const edited = await editPictureUser(userId, uploadResult.url);
                    delete edited.password;
                    delete edited.refreshToken;
                    return res.status(200).json(resSuccess("Berhasil mengupload gambar", edited));
                } catch (error) {
                    return res.status(500).json(resServerError());
                }
            });

            return;
        }

        return res.status(405).json(resNotAllowed());

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json(resServerError());
    }
}

export default userAuth(handler);
