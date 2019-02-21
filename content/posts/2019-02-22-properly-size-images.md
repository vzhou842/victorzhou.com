---
title: Properly Size Images for the Web
date: "2019-02-22T12:00:00.000Z"
template: "post"
draft: false
slug: "/blog/properly-size-images/"
img: "/media/webpack.png"
category: "Web Development"
tags:
  - "Web Development"
  - "Best Practices"
  - "Performance"
description: "Even weather.com is doing this wrong - are you?"
---

I usually check the weather on my phone, but last week I visited [weather.com](https://weather.com) on my laptop. Here's what I saw:

<video class="with-shadow" autoplay loop muted controls />
  <source src="/media/image-sizing-post/weather.com article.mp4" type="video/mp4" />
</video>
<figcaption>
  This was taken with Network throttling set to "Fast 3G" in Chrome to simulate the slow connection I had.
</figcaption>

<div class="spacing"></div>

Why is the image in the top right so much slower to load than the others around it? I opened up Chrome Devtools to check it out:

<img class="with-shadow" src="/media/image-sizing-post/map-inspected.png"></img>

**"intrinsic: 1280 x 720 pixels"**. That means the source image was 1280 x 720 despite the actual displayed `html›<img>` element being much smaller! The largest that `html›<img>` element grows to on weather.com is 232 x 130, but **your browser still has to download the entire 1280 x 720 image** to display it. This unnecesarily slows down the site and wastes bandwidth.

Here's a side-by-side comparison of the original image and a smaller version of it:

<div class="inline-images-container">
  <div class="inline-image-wrapper">
    <img src="/media/image-sizing-post/map-big.jpg" width="232" height="130" />
    <figcaption>Original (1280 x 720)</figcaption>
  </div>
  <div class="inline-image-wrapper">
    <img src="/media/image-sizing-post/map-small.jpg" width="232" height="130" />
    <figcaption>Resized (464 x 260)</figcaption>
  </div>
</div>
<figcaption>
  Both images above are being displayed at a resolution of 232 x 130.
</figcaption>

Can you tell the difference between them without zooming in? I can't. The original image is 213 kB, but the resized one is only 66 kB. That's a savings of **147 kB**, or **69%**! This is especially impactful given the image's prominent location on the weather.com homepage.

>Note: I resize to 464 x 260 instead of 232 x 130 to [support Retina displays](https://www.danrodney.com/blog/retina-web-graphics-explained-1x-versus-2x-low-res-versus-hi-res/).

Here's another instance of the same issue on weather.com:

<video autoplay loop muted controls />
  <source src="/media/image-sizing-post/weather.com popup.mp4" type="video/mp4" />
</video>

<div class="spacing"></div>

The <a href="/media/image-sizing-post/clouds-big.jpg" target="_blank">original image</a> is 2600 x 1733, but it's used as the `css›background-image:` for a `html›<div>` that's only 595 x 350:

![](/media/image-sizing-post/clouds-inspected.png)

That means only 595 x 350 (or 1190 x 700 on Retina displays) of the original image is being used, so the rest could just be cropped out. Even on a Retina display, **82%** of the original image goes unused.

<style>
  .clouds-image {
    background-color: navy;
    margin: 0 auto;
    width: 535px;
    height: 290px;
    padding: 30px;
  }

  .clouds-image h3, .clouds-image p {
    color: white;
    text-align: center;
  }

  @media screen and (max-width: 685px) {
    .clouds-image {
      width: 278px;
      height: 280px;
      padding: 10px;
    }
  }
</style>
<div class="inline-images-container">
  <div class="inline-image-wrapper" style="margin-bottom: 20px;">
    <div class="clouds-image" style="background-image: url(/media/image-sizing-post/clouds-big.jpg);">
      <h3 style="color: white;">Example Weather Channel Popup</h3>
      <p style="color: white;">Please turn off your ad blocker so our site can load even slower than it already does. Thank you for your cooperation.</p>
    </div>
    <figcaption>Original (2600 x 1733)</figcaption>
  </div>
  <div class="inline-image-wrapper">
    <div class="clouds-image" style="background-image: url(/media/image-sizing-post/clouds-cropped.jpg);">
      <h3 style="color: white;">Example Weather Channel Popup</h3>
      <p style="color: white;">Please turn off your ad blocker so our site can load even slower than it already does. Thank you for your cooperation.</p>
    </div>
    <figcaption>Cropped (1190 x 700)</figcaption>
  </div>
</div>

The original image is 779 kB, but the cropped one is only 173 kB - that's a savings of **606 kB**, or **78%**!

Want to learn more? Read [Google's recommendations](https://developers.google.com/web/tools/lighthouse/audits/oversized-images) on properly sizing images.

