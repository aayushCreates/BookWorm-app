import { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary.config";
import streamifier from 'streamifier';

export default async function uploadToCloudinary(fileBuffer: Buffer) {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "book_images",
        resource_type: "auto",
      },
      (err, result) => {
        if (err) {
          return reject(err);
        }

        if (!result) {
          return reject(new Error("Upload failed"));
        }

        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
}
