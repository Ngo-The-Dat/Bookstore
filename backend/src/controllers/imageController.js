import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3 } from "../config/aws.js";
import { upload_to_s3, get_from_s3, delete_from_s3, get_url } from "../services/s3.services.js"

export const upload_images = async (req, res) => {
    try {
        const { height, width } = req.query
        const files = req.files;
        const filename = []
        for (const file of files) {
            await upload_to_s3(file, Number(height), Number(width))
            filename.push(file.originalname)
        }

        res.status(200).json({
            success: true,
            images: filename
        })
    } catch (error) {
        res.status(500).json({ message: "Đã có lỗi xảy ra ở upload_images", error: error.message })
    }
}

export const get_image = async (req, res) => {
    try {
        const result = await get_from_s3(req.query.name)
        res.setHeader("ContentType", result.ContentType);
        result.Body.pipe(res);

    } catch (error) {
        res.status(500).json({ message: "Đã có lỗi xảy ra ở get_image", error: error.message })
    }
}

export const get_image_url = async (req, res) => {
    try {
        const url = await get_url(req.query.name)
        res.status(200).json({
            success: true,
            url: url
        });
    } catch (error) {
        res.status(500).json({ message: "Đã có lỗi xảy ra ở get_image_url", error: error.message })
    }
}

export const delete_image = async (req, res) => {
    try {
        await delete_from_s3(req.query.name)
        res.status(201).json({ message: `Đã xóa thành công ${req.query.name}` })
    } catch (error) {
        res.status(500).json({ message: "Đã có lỗi xảy ra ở delete_image", error: error.message })
    }
}

export const list_images_name = async (req, res) => {
    try {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME
        };

        const command = new ListObjectsV2Command(params);
        const response = await s3.send(command);
        res.status(200).json(response.Contents?.map(obj => obj.Key) || [])
    } catch (error) {
        res.status(500).json({ message: `Lỗi ở list_images_name`, error: error.message })
    }

}

export const get_multi_image_url = async (req, res) => {
    try {
        const names = req.query.names.split(',');
        const urls = []

        for (const name of names) {
            const url = await get_url(name.trim())
            urls.push(url)
        }
        res.status(200).json({ success: true, urls })

    } catch (error) {
        res.status(500).json({ message: `Lỗi ở get_multi_image_url`, error: error.message })
    }
}

export const upload_images_card = async (req, res) => {
    try {
        const files = req.files;
        const filename = []
        for (const file of files) {
            await upload_to_s3(file, 240, 190)
            filename.push(file.originalname)
        }

        res.status(200).json({
            success: true,
            images: filename
        })
    } catch (error) {
        res.status(500).json({ message: "Đã có lỗi xảy ra ở upload_images", error: error.message })
    }
}

export const upload_images_detail = async (req, res) => {
    try {
        const files = req.files;
        const filename = []
        for (const file of files) {
            await upload_to_s3(file, 498, 488)
            filename.push(file.originalname)
        }

        res.status(200).json({
            success: true,
            images: filename
        })
    } catch (error) {
        res.status(500).json({ message: "Đã có lỗi xảy ra ở upload_images", error: error.message })
    }
}