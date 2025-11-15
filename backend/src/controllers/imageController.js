import { S3, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/aws.js";
import sharp from 'sharp'

export const upload_image = async (req, res) => {
    try {
        const buffer = await sharp(req.file.buffer).resize({ height: 1080, width: 1920, fit: 'contain' }).toBuffer()
        const params = ({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: req.file.originalname,
            Body: buffer,
            ContentType: req.file.mimetype
        })

        const command = new PutObjectCommand(params)
        await s3.send(command)
        const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.file.originalname}`;
        res.status(200).json({
            success: true,
            url: imageUrl
        })
    } catch (error) {
        res.status(500).json(res.status(500).json({ message: "Đã có lỗi xảy ra ở upload_image", error: error.message }))
    }
}

export const get_image = async (req, res) => {
    try {
        const params = ({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: req.query.name,
        })
        const command = new GetObjectCommand(params)
        const result = await s3.send(command)
        res.setHeader("Content-Type", result.ContentType);
        result.Body.pipe(res);
    } catch (error) {
        res.status(500).json(res.status(500).json({ message: "Đã có lỗi xảy ra ở get_image", error: error.message }))
    }
}

export const delete_image = async (req, res) => {
    try {
        const name = req.query.name;
        const params = ({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: name,
        })
        const command = new DeleteObjectCommand(params)
        await s3.send(command)
        res.status(201).json({ message: `Đã xóa thành công ${name}` })
    } catch (error) {
        res.status(500).json(res.status(500).json({ message: "Đã có lỗi xảy ra ở delete_image", error: error.message }))
    }
}