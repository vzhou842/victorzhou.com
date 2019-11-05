---
title: "Sendy is Insecure: How Not to Implement reCAPTCHA"
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

I sent what I'd found to Ben immediately:

![](./media-link/sendy-recaptcha/email3.png)

As you can probably guess, his response was not was I was hoping for:

![](./media-link/sendy-recaptcha/email4.png)

Oh no. 🤦🏻‍♂️

![](./media-link/sendy-recaptcha/email5.png)

Anyways, I'll spare you the rest of this email chain because it doesn't really go anywhere. That's why I'm writing this post - if you're reading this, **please patch this issue, Ben!**

## Come on, Victor, is this really such a big deal?

Yes. Recall this quote from my most recent email to Ben:

> What good is reCAPTCHA if **anybody with a computer can write a script in 5 minutes to spam your email list** with thousands of fake signups?

Okay, it's a little exaggerated (you'd obviously need some programming / web dev experience), but I stand by that point. Let me prove it to you.

Here's a Node.js script that spams a Sendy email list:

```js
// Header: spam-sendy.js
const request = require('request');
for (let i = 0; i < 100; i++) {
  request.post('https://sendy.victorzhou.com/subscribe').form({
    email: `sendy-vulnerability-${i}@victorzhou.com`,
    list: 'TEST_LIST_ID_HERE',
  });
}
```
<figcaption><b>WARNING: DO NOT</b> use this code to attack a real email list without permission. That's super illegal and can get you in serious trouble.</figcaption>

That's **7 lines of code** to send as many spam signups as you want. To test this, I set up a test list on my actual Sendy account, enabled reCAPTCHA for it using my real reCAPTCHA keys, and ran the script.

![](./media-link/sendy-recaptcha/spam-result.png)

**It works**. If you're currently using Sendy's reCAPTCHA implementation to "protect" your email list, now you know: it's doing nothing.

## So how _do_ I protect my email list?!

Well, ideally Sendy would release a patch that fixes this issue. Then you'd just have to update your installation and you'd be good to go!

In case Sendy doesn't release a fix soon, here's how you can modify your Sendy installation yourself to fix this:

1. Open `subscribe.php` in the root directory of your Sendy installation.
2. Find where the reCAPTCHA verification happens. For me (Sendy v4.0.3.1), it started at this line of code:

```php
if($recaptcha_secretkey!='')
```
<figcaption>You can probably just search the file for this line of code.</figcaption>

3. Move that entire `if` statement block _outside_ of the `$subform` check. Here's what the result looked like for me:

```php
// Header: subscribe.php
// This is where the reCAPTCHA logic should end up
if ($recaptcha_secretkey != '') {
  // the rest of the reCAPTCHA code here
}

if ($subform) {
  // Some IP Address logic here
  // ...

  // This is where the reCAPTCHA logic used to be
  // ...

  // Some more stuff afterwards
  // ...
}
```

## In Conclusion,

Please don't implement reCAPTCHA like this.
