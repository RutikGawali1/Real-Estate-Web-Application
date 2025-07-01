const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) { return res.status(400).json({ success: false, message: 'No file uploaded' }); }

        const { folder, publicId } = req.body;
        const stream = Readable.from(req.file.buffer);

        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
            resource_type: 'auto',
            folder: folder || 'uploads',
            public_id: publicId || undefined
        };

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                options,
                (error, result) => {
                    if (error) { reject(error); }
                    else { resolve(result); }
                }
            );
            stream.pipe(uploadStream);
        });

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            data: result
        });

    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        res.status(500).json({
            success: false,
            message: 'File upload failed',
            error: error.message
        });
    }
};

exports.getFile = async (req, res) => {
    try {
        const { publicId } = req.body;

        if (!publicId) { return res.status(400).json({ success: false, message: 'Public ID is required' }); }

        const result = await cloudinary.api.resource(publicId);

        res.status(200).json({
            success: true,
            message: 'File retrieved successfully',
            data: result
        });

    } catch (error) {  
        if (error.http_code === 404) { return res.status(404).json({ success: false, message: 'File not found' }); }

        res.status(500).json({
            success: false,
            message: 'Failed to retrieve file',
            error: error.message
        });
    }
};

exports.deleteFile = async (req, res) => {
    try {
        const { publicId } = req.body;

        if (!publicId) { return res.status(400).json({ success: false, message: 'Public ID is required' }); }

        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === 'ok') {
            res.status(200).json({
                success: true,
                message: 'File deleted successfully',
                data: result
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'File deletion failed',
                data: result
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete file',
            error: error.message
        });
    }
};