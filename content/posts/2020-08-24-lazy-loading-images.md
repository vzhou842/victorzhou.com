---
title: "No More Excuses: Lazy Load Your Images"
date: "2020-08-24T12:00:00.000Z"
template: "post"
draft: false
isWeb: true
slug: "/blog/lazy-loading-images/"
img: "https://victorzhou.com/media/lazy-load-post/webstack.png"
category: "Web Development"
tags:
  - "Web Development"
  - "Performance"
  - "Best Practices"
description: "Yes, you. Your site should probably be doing this."
prev: "/blog/minify-svgs/"
next: "/blog/properly-size-images/"
---

If you're anything like me, you've been putting off lazy loading images on your website(s) for a long time. You've always known it was possible (recommended, even), but over time you've gotten good at coming up with "reasons" not to do it:

- How can this be a performance optimization if I'm *adding* code
- There are too many lazy loading libraries, I'd probably make the wrong choice anyways
- In this day and age who still cares about bandwidth... not me, and certainly not my users
- I'll do it tomorrow

You'll tell yourself anything to keep procrastinating this, but that ends today. **It's time: lazy load your images.**

## Native lazy loading is here

...and it literally could not be easier to enable.

Here's an image:

```html
<img src="/image.png">
```

and here's an image with native lazy loading:

```html
<img src="/image.png" loading="lazy">
```

That's right - [browser-level native lazy loading is here](https://web.dev/native-lazy-loading/), and the majority of your users will be using [browsers that support it](https://caniuse.com/#feat=loading-lazy-attr). Plus, there's no downside - browsers that don't support this yet will just ignore the `loading` attribute.

It's trivial to implement, it won't break your site for anyone, and it's a win for most users - the verdict is clear, right?


## Or, do it with a library

...if ~~you're a tryhard~~ lazy loading is especially important for your site. That way, you can lazy load even in browsers that don't support it natively!

If you want, you can use the library as a fallback:

```js
if ('loading' in HTMLImageElement.prototype) {
  // browser supports native lazy loading
} else {
  // download and use a lazy loading library
}
```

The [lazysizes](https://github.com/aFarkas/lazysizes) library is a popular choice. I won't get into the details here, but [this](https://web.dev/native-lazy-loading/#how-do-i-handle-browsers-that-don't-yet-support-native-lazy-loading) might help you get started.


## Um, I've heard you actually shouldn't lazy load images

Well, ~~you heard wrong~~ that's probably true in some cases. There might be scenarios out there for which you could justify eager loading. I'm not saying everyone should always be lazy loading, I'm saying that *it's pretty likely you should be* if you're not already. [Lighthouse](https://developers.google.com/web/tools/lighthouse) agrees with me - in their words, [defer offscreen images](https://web.dev/offscreen-images/).

> "Offscreen" is an important qualifier: above-the fold images would never get lazy loaded anyways, so it's [recommended](https://web.dev/native-lazy-loading/#is-there-a-downside-to-lazy-loading-images-that-are-within-the-device-viewport) to avoid applying `loading="lazy"` at all.


## Here are some images with native lazy loading enabled

But first, I need to make this post longer to push the images down so they actually get lazy loaded.

<div style="height: 800px;"></div>

There we go. Now, look - they work just like normal images, right?

![](./media-link/lazy-load-post/webstack.png)

![](./media-link/lazy-load-post/macbook.png)

![](./media-link/lazy-load-post/programming.png)

Anyways, enough chit-chat. You know what to do, so get to it.
