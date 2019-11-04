---
title: "Sendy is Insecure (or, How Not to Implement reCAPTCHA)"
date: "2019-11-04T12:00:00.000Z"
template: "post"
draft: false
twitterEmbed: true
slug: "/blog/sendy-recaptcha-security/"
img:
category: "Security"
tags:
  - "Security"
  - "Programming"
  - "Best Practices"
description: WIP Description
prev: "/blog/avoid-premature-optimization/"
next: "/blog/minify-svgs/"
---

A few months ago, I wrote a post about [why I switched from Mailchimp to Sendy](/blog/mailchimp-to-sendy/). The gist is that Mailchimp got too expensive too fast, and [Sendy](https://sendy.co/?ref=Tl4Ot) was a fully-featured self-hosted option that would save me a lot of money.

In the time since I made the switch to Sendy, I've been generally fairly satisfied with the software. My email newsletter was steadily growing without any problems... until this:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Anyone ever seen spam like this before? A while back I started getting spam signups to my email newsletter of the same emails using the gmail period trick (<a href="https://t.co/l85oxrnm0f">https://t.co/l85oxrnm0f</a>)... is the goal here just to get my emails reported as spam? <a href="https://t.co/JXzIxUt0wR">pic.twitter.com/JXzIxUt0wR</a></p>&mdash; Victor Zhou (@victorczhou) <a href="https://twitter.com/victorczhou/status/1162645289213186050?ref_src=twsrc%5Etfw">August 17, 2019</a></blockquote>

Sendy treats each of these signups as a different user / email address, but because of the [Gmail period trick](https://gmail.googleblog.com/2008/03/2-hidden-ways-to-get-more-from-your.html) they're all actually the same email. That means **these email addresses were getting all of my emails multiple times**, which is an easy way to get reported for spam.

This incident finally spurred me to invest in protecting my email newsletter (which I probably should've done in the first place). I noticed Sendy seemed to have [reCAPTCHA v2](https://developers.google.com/recaptcha/docs/display) support built-in, so I started there. I couldn't get the server-side validation to work, though, so I reached out to [Ben, the creator of Sendy](https://sendy.co/forum/profile/8/Ben), for help:

![](./media-link/sendy-recaptcha/email1.png)

Here's what he responded with the next day:

![](./media-link/sendy-recaptcha/email2.png)

Wait. Hold up a second there.

> There's no way to implement Google's reCAPTCHA in an API.

What?! 🤔 That can't be right. There's literally a section called [Server Side Validation](https://developers.google.com/recaptcha/docs/verify) in the reCAPTCHA documentation.

I did some further investigation into the [standard subscribe form](https://sendy.victorzhou.com/subscription?f=K892tNsoSJBXB56YBbPUmxU74VxOqJ5DMbMZ6wxMWPQ4X6amCgnApdNbY763h0onBKMcQ751ge1VN7MtbBR11Hu7zA) in an attempt to understand what Ben meant. Here's an abbreviated version of the HTML behind that form:

```html
<form action="https://sendy.victorzhou.com/subscribe" method="POST">
  <div>
    <label for="name">Name</label>
    <input type="text" name="name" id="name">
  </div>
  <div>
    <label for="email">Email</label>
    <input type="email" name="email" id="email">
  </div>
  <input type="hidden" name="list" value="LIST_ID_HERE">
  <input type="hidden" name="subform" value="yes">
  <div class="g-recaptcha" data-sitekey="SITE_KEY_HERE">
    <!-- some more reCAPTCHA stuff here -->
  </div>
  <a>Subscribe to list</a>
</form>
```

The first thing I noticed was the value of the form's `action` attribute: https://sendy.victorzhou.com/subscribe. Interestingly enough, that's the exact URL where the official [Sendy API](https://sendy.co/api) lives.

Now, we know the standard subscribe form:

1. Has a working server-side validated reCAPTCHA implementation (I tested it).
2. Uses the official Sendy Subscribe API.

> There's no way to implement Google's reCAPTCHA in an API.

???

Anyways, moving on. Why would Ben tell me that reCAPTCHA would "_take effect for for the standard subscribe forms that Sendy provides, not the subscribe API_"?

Did you notice this line I've highlighted below in the HTML form?

```html
<form action="https://sendy.victorzhou.com/subscribe" method="POST">
  <div>
    <label for="name">Name</label>
    <input type="text" name="name" id="name">
  </div>
  <div>
    <label for="email">Email</label>
    <input type="email" name="email" id="email">
  </div>
  <input type="hidden" name="list" value="LIST_ID_HERE">
  <input type="hidden" name="subform" value="yes"> <!-- highlight-line -->
  <div class="g-recaptcha" data-sitekey="SITE_KEY_HERE">
    <!-- some more reCAPTCHA stuff here -->
  </div>
  <a>Subscribe to list</a>
</form>
```

Why would the official Sendy form include a hardcoded `subform` field that's not documented in the [Sendy API](https://sendy.co/api)?

Yup, you (might have) guessed it. The `subform` field **enables server-side reCAPTCHA verification**. If that field isn't set to `yes`, **server-side reCAPTCHA is completely disabled**.

![](./media-link/sendy-recaptcha/email3.png)
![](./media-link/sendy-recaptcha/email4.png)
![](./media-link/sendy-recaptcha/email5.png)
