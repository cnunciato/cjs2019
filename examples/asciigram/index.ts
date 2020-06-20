import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const asciify = require("asciify-image");

// Create a DynamoDB table for our images.
const table = new aws.dynamodb.Table("images", {
    attributes: [{ name: "created", type: "N" }],
    hashKey: "created",
    readCapacity: 1,
    writeCapacity: 1
});

// Create an AWS resource (S3 Bucket)
const bucket = new aws.s3.Bucket("images");

// Create an event handler to respond to bucket uploads.
bucket.onObjectCreated("handler", async (event) => {
    console.log(event);

    if (!event.Records) {
        return;
    }

    const [ record ] = event.Records;
    const s3 = new aws.sdk.S3();
    const file = await s3.getObject({
        Bucket: bucket.id.get(),
        Key: record.s3.object.key
    }).promise();

    // ASCIIfy the image.
    const asciified = await asciify(file.Body, { fit: "box", width: 40});

    // Write it to the database.
    const client = new aws.sdk.DynamoDB.DocumentClient();
    await client.put({
        TableName: table.name.get(),
        Item: {
            created: new Date().getTime(),
            asciified
        }
    }).promise();
});

// Create a home page and JSON API.
const api = new awsx.apigateway.API("api", {
    routes: [
        {
            path: "/",
            localPath: "www"
        },
        {
            path: "/images",
            method: "GET",
            eventHandler: async (event) => {

                // Fetch the images from the database.
                const client = new aws.sdk.DynamoDB.DocumentClient();
                const items = await client.scan({
                    TableName: table.name.get(),
                    ProjectionExpression: "created, asciified"
                }).promise();

                // Return the list.
                return {
                    statusCode: 200,
                    body: JSON.stringify(items.Items)
                };
            }
        }
    ]
});

// Export the name of the bucket
export const bucketName = bucket.id;

// Export the URL of the website.
export const url = api.url;
