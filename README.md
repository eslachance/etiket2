# Etiket 2

(For the old version, see [this repository](https://github.com/eslachance/etiket))

Etiket is a tagbot with all of the features you'd expect for such a bot, and more!

- Per-server tags
- Tag administration, add, delete, rename, etc.
- Tag search
- Blacklist command
- Anti-spam measures
- Permission levels (only mods and higher can edit, bot owner commands)
- Reaction-based permission feedback (🚫 for no permission, etc)
- Dashboard for administration and documentation
- Unique admin features: copying and listing all tags, cleanup, etc.

## Requirements

- `git` command line ([Windows](https://git-scm.com/download/win)|[Linux](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)|[MacOS](https://git-scm.com/download/mac)) installed
- `node` [Version 10.x or higher](https://nodejs.org)
- [Pre-requisites for Enmap](https://enmap.evie.codes/install#pre-requisites)

You also need your bot's token. This is obtained by creating an application in
the Developer section of discordapp.com. Check the [first section of this page](https://anidiots.guide/getting-started/the-long-version.html) 
for more info.

## Downloading

In a command prompt in your projects folder (wherever that may be) run the following:

`git clone https://github.com/eslachance/etiket2.git`

Once finished: 

- In the folder from where you ran the git command, run `cd etiket2` and then run `npm install`
- Rename or copy `config.js.example` to `config.js`
- Edit `config.js` and fill in all the relevant details as indicated in the file's comments (specific details below).

## Using ngrok

[ngrok](https://ngrok.io/) is a network tunnel (sort of like a reverse VPN) that allows outside communications through ngrok 
to be directly pointed to your machine, regardless of any network restrictions. It works through firewalls, proxies, everything.

Because of what Etiket requires for the dashboard, ngrok will only work with the *paid* version, which starts at $5/month USD.
It will function through an ngrok subdomain, where the "external" port will always be 80 or 443, and the internal port is whatever you want.

In the config.js, the ngrok options must be as follows: 
- `enabled: true` to turn this feature on. (Note: will crash if not configured properly!)
- `addr: 8000` for the internal port. This port will not be open to the public, it's only open to ngrok. It must match the dashboard port config below it.
- `authtoken` must be the token obtained from [your ngrok auth page](https://dashboard.ngrok.com/auth).
- `region` must be a valid ngrok region from [their available regions](https://ngrok.com/docs#global) (us, eu, ap, au).
- `subdomain` must be your custom ngrok subdomain, set in [your ngrok link page](https://dashboard.ngrok.com/reserved).

> **Note**: You can also create a custom subdomain on your own registered domain from the link page, and by adding TXT records. See ngrok's documentation to know how,
and add `hostname: yoursubdomain.yourdomain.com` to the configuration, instead of the `subdomain` option.

## Configuring the Dashboard

The Etiket dashboard is based on the [Guidebot Dashboard](https://github.com/AnIdiotsGuide/guidebot/tree/dashboard) repository
with very little modifications. It uses Discord's Oauth2 to authenticate users, and will immediately be aware of administrator access,
giving you more options. Server owners will also have the ability to modify their own server configurations. This configuration 
should be very precisely done. In the config.js file, under `dashboard`, setup the following:

- `oauthSecret` is obtained from [your Discord Developer page](https://discordapp.com/developers/applications/), clicking your app, then copying the `Client Secret` on this page.
- `callbackURL` should be your publicly accessible URL, with `/callback` at the end. This can be the ngrok URL above, or your own subdomain/domain pointing to your server. 
For testing, you may also simply use `http://localhost:8000/callback`. Note that this *must* match the Callback URL set in your Discord Developer page, under the **Oauth2** page.
- `sessionSecret` is your own choice. It acts like an internal password for sessions data storage. It should be a long sentence, without spaces or special characters.
- `domain` should be your publicly accessible URL without the `/callback` at the end, or the http/https at the beginning.
- `port` should be your publicly accessible port, or one matching the ngrok `addr` option.

## Starting the bot

To start the bot, in the command prompt, run the following command:
`node index.js`

## Inviting to a guild

To add the bot to your guild, you have to get an oauth link for it. See [this page in An Idiot's Guide](https://anidiots.guide/getting-started/getting-started-long-version#add-your-bot-to-a-server)
for details on how to do this.

You can use this site to help you generate a full OAuth Link, which includes a calculator for the permissions:
[https://finitereality.github.io/permissions-calculator/?v=0](https://finitereality.github.io/permissions-calculator/?v=0)

## Enabling the Enamp docs command

In order to enable the docs command, you need to install `jsdoc`, with the following command: `npm i -g jsdoc`. After this, run `npm run docs` in the same folder as you ran `npm install`. Within a couple of seconds this command finished, and the docs command will be automaticly enabled.
