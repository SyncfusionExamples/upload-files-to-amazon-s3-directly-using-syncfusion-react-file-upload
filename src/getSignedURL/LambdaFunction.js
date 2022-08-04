// eslint-disable-next-line strict
'use strict'

const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION })
const s3 = new AWS.S3()
// Add your Bucket name below
const bucketName = "";
// Change this value to adjust the signed URL's expiration
const URL_EXPIRATION_SECONDS = 500

// Main Lambda entry point
exports.handler = async (event) => {
    return await getUploadURL(event)
}

const getUploadURL = async function(event) {
    // Get the original file name
    const fileName = event['queryStringParameters']['file_name'];
    const Key = fileName;

    // Get signed URL from S3
    const s3Params = {
        Bucket: bucketName,
        Key,
        Expires: URL_EXPIRATION_SECONDS
    }

    const uploadURL = await s3.getSignedUrlPromise('putObject', s3Params)

    return JSON.stringify({
        uploadURL: uploadURL,
        Key
    })
}
