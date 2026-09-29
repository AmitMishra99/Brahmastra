import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { client } from "../config/amazonS3.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export const getFromS3 = async (fileName, expiresIn) => {
  console.log("Generating signed URL...");

  const url = await getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
    }),
    { expiresIn },
  );

  console.log("Signed URL generated:", url);

  return url;
};
