import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as glob from "glob";
import * as mime from "mime";
import * as fs from "fs";

// Create a bucket to hold the slides. Make it a website, too.
const bucket = new aws.s3.Bucket("slides", {
    forceDestroy: true,
    website: {
        indexDocument: "index.html"
    }
});

// Collect the files of the slides "site" and push them to S3.
glob.sync("www/**/*").forEach((path: string) => {
    if (!fs.lstatSync(path).isDirectory()) {
        new aws.s3.BucketObject(path.replace("www/", ""), {
            bucket,
            source: new pulumi.asset.FileAsset(path),
            contentType: mime.getType(path) || "text/plain",

            // The public-read permission tells AWS to allow these files to be accessed, well, publicly. :)
            acl: aws.s3.PublicReadAcl
        });
    }
});

// Export the name and URL of the bucket.
export const bucketName = bucket.id;
export const bucketUrl = bucket.websiteEndpoint;
