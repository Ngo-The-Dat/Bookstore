import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3 } from "../config/aws.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import sharp from 'sharp'

const upload_to_s3 = async (file) => {
    const buffer = await sharp(file.buffer)
        .resize({ height: 1080, width: 1920, fit: 'contain' })
        .toBuffer()
    const params = ({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.originalname,
        Body: buffer,
        ContentType: file.mimetype
    })
    const command = new PutObjectCommand(params);
    await s3.send(command);
}

const get_from_s3 = async (name) => {
    const params = ({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: name
    })
    const command = new GetObjectCommand(params)
    return await s3.send(command)
}

const delete_from_s3 = async (name) => {
    const params = ({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: name,
    })
    const command = new DeleteObjectCommand(params)
    await s3.send(command)
}

const get_url = async (name) => {
    const params = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: name
    });
    return await getSignedUrl(s3, params)
}

export const upload_images = async (req, res) => {
    try {
        const files = req.files;
        for (const file of files) {
            await upload_to_s3(file)
        }

        res.status(200).json({
            success: true,
        })
    } catch (error) {
        res.status(500).json(res.status(500).json({ message: "Đã có lỗi xảy ra ở upload_images", error: error.message }))
    }
}

export const get_image = async (req, res) => {
    try {
        const result = await get_from_s3(req.query.name)
        res.setHeader("ContentType", result.ContentType);
        result.Body.pipe(res);

    } catch (error) {
        res.status(500).json(res.status(500).json({ message: "Đã có lỗi xảy ra ở get_image", error: error.message }))
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
        res.status(500).json(res.status(500).json({ message: "Đã có lỗi xảy ra ở get_image_url", error: error.message }))
    }
}

export const delete_image = async (req, res) => {
    try {
        await delete_from_s3(req.query.name)
        res.status(201).json({ message: `Đã xóa thành công ${req.query.name}` })
    } catch (error) {
        res.status(500).json(res.status(500).json({ message: "Đã có lỗi xảy ra ở delete_image", error: error.message }))
    }
}

export const list_images_name = async (req, res) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME
    };

    const command = new ListObjectsV2Command(params);
    const response = await s3.send(command);
    res.status(200).json(response.Contents?.map(obj => obj.Key) || [])
}

