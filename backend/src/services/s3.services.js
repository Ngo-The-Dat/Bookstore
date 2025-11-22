import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3 } from "../config/aws.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import sharp from 'sharp'

export const upload_to_s3 = async (file, h, w) => {
    const buffer = await sharp(file.buffer)
        .resize({ height: h, width: w, fit: 'contain' })
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

export const get_from_s3 = async (name) => {
    const params = ({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: name
    })
    const command = new GetObjectCommand(params)
    return await s3.send(command)
}

export const delete_from_s3 = async (name) => {
    const params = ({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: name,
    })
    const command = new DeleteObjectCommand(params)
    await s3.send(command)
}

export const get_url = async (name) => {
    const params = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: name
    });
    return await getSignedUrl(s3, params)
}
