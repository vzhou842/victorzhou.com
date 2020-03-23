---
title: "Sendy is Insecure: How Not to Implement reCAPTCHA"
date: "2019-11-08T12:00:00.000Z"
dateModified: "2019-11-09T12:00:00.000Z"
template: "post"
draft: false
slug: "/blog/sendy-recaptcha-security/"
img: "https://victorzhou.com/media/sendy-recaptcha/recaptcha.png"
isWeb: true
category: "Security"
tags:
  - "Security"
  - "Programming"
  - "Best Practices"
  - "Web Development"
description: Sendy's reCAPTCHA implementation doesn't do anything.
prev: "/blog/avoid-premature-optimization/"
next: "/blog/minify-svgs/"
discussLinkHN: https://news.ycombinator.com/item?id=21483597
discussLinkReddit: https://www.reddit.com/r/programming/comments/dtiurq/sendy_is_insecure_how_not_to_implement_recaptcha/
discussLinkTwitter: https://twitter.com/victorczhou/status/1192880134354657280
popularity: 10
---

> EDIT: We did it - Sendy has [released a patch](https://sendy.co/get-updated) (v4.0.3.3) for this issue! I recommend upgrading if you're affected. Thanks to Sendy for the quick response to this blog post, and thanks to every reader who helped make this happen.

A few months ago, I switched from Mailchimp to [Sendy](https://sendy.co/?ref=Tl4Ot), a self-hosted email newsletter alternative. I wrote a whole post about [why I switched from Mailchimp to Sendy](/blog/mailchimp-to-sendy/), but the gist is that Mailchimp got too expensive too fast.

Since then, I've been generally satisfied with Sendy. Until one day, this happened:

![Spam signups to my Sendy email list](./media-link/sendy-recaptcha/spam.jpeg)

Sendy sees these email addresses as **distinct**, but they're actually largely **duplicates** because of the [Gmail period trick](https://gmail.googleblog.com/2008/03/2-hidden-ways-to-get-more-from-your.html). That means these email addresses were getting all of my emails (including the double opt-in ones) multiple times, which is an easy way for me to get reported for spam.

This incident finally spurred me to invest in protecting my email newsletter (_which I really should've done in the first place_). Luckily for me, Sendy comes with [reCAPTCHA v2](https://developers.google.com/recaptcha/docs/display) support built-in! I thought it'd be easy to setup, but for some reason I couldn't get it to work with [my custom subscribe form](/subscribe/?src=sendy-recaptcha-post), so I reached out to Sendy for help:

![](./media-link/sendy-recaptcha/email1.png)

Here's what he responded with the next day:

![](./media-link/sendy-recaptcha/email2.png)

This line stuck out to me:

> There's no way to implement Google's reCAPTCHA in an API.

That can't be right - the reCAPTCHA documentation has a dedicated section on [Server Side Validation](https://developers.google.com/recaptcha/docs/verify)!

I did some further investigation into Sendy's [standard subscribe form](https://sendy.victorzhou.com/subscription?f=K892tNsoSJBXB56YBbPUmxU74VxOqJ5DMbMZ6wxMWPQ4X6amCgnApdNbY763h0onBKMcQ751ge1VN7MtbBR11Hu7zA) in an attempt to understand what Ben meant. Here's an abbreviated version of the HTML behind that form:

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

Those two facts refute this claim:

> There's no way to implement Google's reCAPTCHA in an API.

Additionally, why would Ben tell me that reCAPTCHA would "_take effect for for the standard subscribe forms that Sendy provides, not the subscribe API_"?

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

Did you notice that highlighted line before? Why would the official Sendy form include a hardcoded `subform` field that's not documented in the [Sendy API](https://sendy.co/api)?

Yup, you (might have) guessed it. The `subform` field **enables server-side reCAPTCHA verification**. If that field isn't set to `yes`, server-side reCAPTCHA is **completely disabled**.

I sent what I'd found to Ben immediately:

![](./media-link/sendy-recaptcha/email3.png)

His response was not what I was hoping for:

![](./media-link/sendy-recaptcha/email4.png)

Oh no. 🤦🏻‍♂️

![](./media-link/sendy-recaptcha/email5.png)

The rest of this email chain doesn't really go anywhere. That's why I'm writing this post - please patch this issue, Ben!

## Come on, Victor, is this really such a big deal?

Yes. Recall this quote from my most recent email to Ben:

> What good is reCAPTCHA if **anybody with a computer can write a script in 5 minutes to spam your email list** with thousands of fake signups?

Okay, it's a little exaggerated (you'd obviously need some programming / web dev experience), but I stand by that point. Let me prove it to you.

Here's a Node.js script that spams a Sendy email list:

```js
// Header: spam-sendy.js
// This code is meant ONLY AS AN EXAMPLE.
// DO NOT USE - it's illegal and will get you in trouble.
const request = require('request');
for (let i = 0; i < 100; i++) {
  request.post('https://sendy.victorzhou.com/subscribe').form({
    email: `sendy-vulnerability-${i}@victorzhou.com`,
    list: 'TEST_LIST_ID_HERE',
  });
}
```
<figcaption><b>WARNING:</b> DO NOT use this code to attack a real email list without permission. That's <a href="https://en.wikipedia.org/wiki/Cybercrime" target="_blank">super illegal</a> and can get you in serious trouble.</figcaption>

That's **7 lines of code** to send as many spam signups as you want. To test this, I set up a test list on my actual Sendy account, enabled reCAPTCHA for it using my real [reCAPTCHA keys](https://developers.google.com/recaptcha/docs/settings), and ran the script.

![](./media-link/sendy-recaptcha/spam-result.png)

**It works**. If you're currently using Sendy's reCAPTCHA implementation, now you know: it's not doing what you think.

## So how _do_ I protect my email list?!

Well, ideally Sendy would release a patch that fixes this issue. Then you'd just have to update your installation and you'd be good to go! **If you're an affected Sendy user, you can help by emailing [hello@sendy.co](mailto:hello@sendy.co) to ask for a patch**. Feel free to link this post as a reference - the more support we can get, the better.

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

You can also [contact me](/contact/) if you have issues protecting your Sendy subscribe form and I'll do my best to help.

## In Conclusion,

Please don't implement reCAPTCHA like this.
