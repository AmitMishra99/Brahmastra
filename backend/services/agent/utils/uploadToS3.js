import { PutObjectCommand } from "@aws-sdk/client-s3";
import { client } from "../config/amazonS3.js";

export const uploadToS3 = async (fileName, buffer, contentType) => {
  await client.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Body: buffer,
      Key: fileName,
      ContentType: contentType,
    }),
  );

  return fileName;
};
