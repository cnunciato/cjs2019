# digital-ocean

This is an example of how you might create a DigitalOcean droplet and a managed PostgreSQL cluster with Pulumi. In the talk, I did this manually in the DigitalOcean dashboard, so I figured I'd show how you might do it with JavaScript, too.

[![Deploy](https://get.pulumi.com/new/button.svg)](https://app.pulumi.com/new)

If you'd like to build one for yourself, the easiest way to get started is to ☝️ click that button and follow the instructions.

You'll need a [DigitalOcean account](https://www.digitalocean.com/), along with a [personal access token](https://www.digitalocean.com/docs/api/create-personal-access-token/), and an [SSH key fingerprint](cloud.digitalocean.com/account/security), so Pulumi can deploy into DigitalOcean on your behalf.

Once you have those two values, just set them as Pulumi secrets:

```
pulumi config set digitalocean:token $YOUR_TOKEN --secret
pulumi config set sshFingerprint $YOUR_FINGERPRINT --secret
```

And then, just `pulumi up`! When you're finished, to tear everything down, run `pulumi destroy`. [See the docs](https://www.pulumi.com/docs/reference/cli/) for more information.

Have fun! And be sure to check out the [Pulumi community Slack](https://slack.pulumi.com/), too.
