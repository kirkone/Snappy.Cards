# Snappy Cards

[![Build and Deploy](https://github.com/kirkone/Snappy.Cards/actions/workflows/deploy-to-pages.yaml/badge.svg?branch=main)](https://github.com/kirkone/Snappy.Cards/actions/workflows/deploy-to-pages.yaml)
[![GitHub issues open](https://img.shields.io/github/issues/kirkone/snappy.cards.svg)](https://github.com/kirkone/Snappy.Cards/issues)
[![GitHub pull requests open](https://img.shields.io/github/issues-pr/kirkone/snappy.cards.svg)](https://github.com/kirkone/Snappy.Cards/pulls)
[![GitHub last commit (branch)](https://img.shields.io/github/last-commit/kirkone/snappy.cards/main)](https://github.com/kirkone/Snappy.Cards/commits/main)

Snappy Cards are for sharing your contact information with others without storing the data on any server.

This site is hosted on GitHub Pages under [snappy.cards/?...](https://snappy.cards/?name=Max%20Mustermann&phone=+49%20123%204567890&mail=no@mail.de&web=blog.undefined.de&sub=Mustermann&avatar=random&background=random) and can be modified by using several [parameters](#parameters).

### Example

![Sample of a card](/doc/images/sample-card.png)
![Sample of a code](/doc/images/sample-code.png)

Here is a live example: [snappy.cards/?...](https://snappy.cards/?name=Max%20Mustermann&phone=+49%20123%204567890&mail=no@mail.de&web=blog.undefined.de&sub=Mustermann&avatar=random&background=random)
```
https://snappy.cards/?name=Max Mustermann&phone=+49 123 4567890&mail=no@mail.de&web=blog.undefined.de&sub=Mustermann&avatar=random&background=random
```

## Parameters

All parameters are optional if you do not want to use them. The order is not relevant.

```
https://snappy.cards/?name={name}&phone={phone}&mail={mail}&web={web}&sub={subtitle}&avatar={unsplash image id | random | URL to image}&background={Unsplash image id | random | URL to image}
```

### name

What you want to show as your name or headline.

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