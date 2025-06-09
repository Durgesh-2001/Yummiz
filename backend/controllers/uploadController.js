import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import fs from 'fs';

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Simple check for Cloudinary config
        if (!process.env.CLOUDINARY_URL) {
            throw new Error('Cloudinary configuration missing');
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'yummiz'
        });

        // Clean up the local file
        fs.unlinkSync(req.file.path);

        res.status(200).json({
            success: true,
            url: result.secure_url,
            public_id: result.public_id
        });
    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

export { upload, uploadImage };
