# Snappy Cards

[![Build and Deploy](https://github.com/kirkone/Snappy.Cards/actions/workflows/deploy-to-pages.yaml/badge.svg?branch=main)](https://github.com/kirkone/Snappy.Cards/actions/workflows/deploy-to-pages.yaml)
[![GitHub issues open](https://img.shields.io/github/issues/kirkone/snappy.cards.svg)](https://github.com/kirkone/Snappy.Cards/issues)
[![GitHub pull requests open](https://img.shields.io/github/issues-pr/kirkone/snappy.cards.svg)](https://github.com/kirkone/Snappy.Cards/pulls)
[![GitHub last commit (branch)](https://img.shields.io/github/last-commit/kirkone/snappy.cards/main)](https://github.com/kirkone/Snappy.Cards/commits/main)

Snappy Cards is for sharing your contact information with others.
This card works with data **only** beeing stored in the URL.
To make sharing easier a QR code is also generated.

This site is hosted on GitHub Pages under [snappy.cards/#...](https://snappy.cards/#name=Max%20Mustermann&phone=%2b49%20123%204567890&mail=no@mail.de&web=blog.undefined.de&sub=Mustermann&avatar=random&background=random) and can be modified by using several [parameters](#parameters).

> **Important**:
> The parameters coming after the `#` will never be sent to the server.
> So **everything** stays on **your** client!
> More details about this can be found on [Wikipedia](https://en.wikipedia.org/wiki/URI_fragment).

### Example

![Sample of a card](/doc/images/sample-card.png)
![Sample of a code](/doc/images/sample-code.png)

Here is a live example: [snappy.cards/#...](https://snappy.cards/#name=Max%20Mustermann&phone=%2b49%20123%204567890&mail=no@mail.de&web=blog.undefined.de&sub=Mustermann&avatar=random&background=random)
```
https://snappy.cards/#name=Max Mustermann&phone=+49 123 4567890&mail=no@mail.de&web=blog.undefined.de&sub=Mustermann&avatar=random&background=random
```

## Parameters

All parameters are optional if you do not want to use them. There is no specific order for them.

```
https://snappy.cards/#name={name}&phone={phone}&mail={mail}&web={web}&sub={subtitle}&avatar={unsplash image id | random | URL to image}&background={Unsplash image id | random | URL to image}
```

### name

Your name or headline.

### job

Your position in your company or job title.

### phone

A phone number. This line is prefixed with a phone symbol.

### mail

A mail address. This line is prefixed with a mail symbol.

### web

A web address. This line is prefixed with a globe symbol.

### sub

A water mark showed on the bottom of the card. Can be any sort of text.

### avatar

This is the avatar image on the card. There are the following options:

**Unsplash Image** Use an ID from [unsplash.com](https://unsplash.com/). You could copy it easily from the URL of a specific image.
**random** A image of a person will randomly taken from [unsplash.com](https://unsplash.com/)
**Image URL** You can provide an URL to your own image.
**blank** Leaf the parameter empty or omit it complete and no avatar will be shown.

### background

This is the background image of the card. There are the following options:

**Unsplash Image** Use an ID from [unsplash.com](https://unsplash.com/). You could copy it easily from the URL of a specific image.
**random** A somewhat blurry image will randomly taken from [unsplash.com](https://unsplash.com/)
**Image URL** You can provide an URL to your own image.
**blank** Leaf the parameter empty or omit it complete and the background will be blank.

### twt - *deprecated, use "x" instead*

Your handle on twitter.

### x

Your handle on x, formerly known as twitter.

### fb

Your handle on Facebook.

### yt

Your handle on Youtube.

### in

Your handle on Instagram.

### twc

Your handle on Twitch.

### gh

Your handle on Github.

### li

Your handle on LinkedIn.

### xi

Your handle on Xing.

### pp

Your handle for Paypal.me

### pa

Your handle on Patreon.

### pi

Your handle on Pinterest.

### npm

Your handle on npmjs.com

### sc

Your handle on Soundcloud.

### sn

Your handle on Snapchat.

### st

Your handle on Steam.

### mc

Your handle on metacpan.

### cfgMaxDetails

Configuration option to determine, how many detail lines are going te be shown.
If the number of detail lines exceeds this configuration option, a button for
toggling the visibility of the remaining detail lines will be shown.

Default is to display all detail lines.

## Authors

-   **Kirsten Kluge** - _Initial work_ - [kirkone](https://github.com/kirkone)
-   **Thomas Müller** - _fanzy functional programming, vcard download_ - [tmueller](https://github.com/tmueller)

See also the list of [contributors](https://github.com/kirkone/Snappy.Cards/graphs/contributors) who participated in this project.

## Acknowledgments

### Design

The design and layout is inspired by this YouTube video: [Html CSS Glassmorphism Business Card Design](https://www.youtube.com/watch?v=Glsby66vuLA) by [Online Tutorials](https://www.youtube.com/channel/UCbwXnUipZsLfUckBPsC7Jog)

### QR Code

For the QR codes, code is used from: Joe Grinstead
[GitHub: grinstead / makeQrCode](https://github.com/grinstead/makeQrCode)

The code base has been slightly modified to work with TypeScript and some unused code has been removed.

### URI fragment

More information about the used uri fragment to store the information on the client side:
[Wikipedia - URI fragment](https://en.wikipedia.org/wiki/URI_fragment)
