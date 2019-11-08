import * as digitalocean from "@pulumi/digitalocean";
import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();

// Create a DigitalOcean droplet.
const droplet = new digitalocean.Droplet("droplet", {
    image: "ubuntu-18-04-x64",
    region: digitalocean.Regions.SFO2,
    size: digitalocean.DropletSlugs.Droplet512mb,
    sshKeys: [config.require("sshFingerprint")],
});

// Create a managed PostgreSQL cluster.
const db = new digitalocean.DatabaseCluster("database", {
    engine: "pg",
    region: digitalocean.Regions.SFO2,
    size: digitalocean.DatabaseSlugs.DB_1VPCU1GB,
    nodeCount: 1,
});

// Export the Droplet's IP4 address.
export const ip = droplet.ipv4Address;
