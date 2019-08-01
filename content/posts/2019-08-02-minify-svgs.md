---
title: Minify Your SVGs
date: "2019-08-02T12:00:00.000Z"
template: "post"
draft: false
isWeb: true
slug: "/blog/minify-svgs/"
img: "https://victorzhou.com/media/laptop-code-2.jpg"
category: "Web Development"
tags:
  - "Web Development"
  - "Best Practices"
  - "Performance"
description: "How I optimize SVGs for this blog and why you probably should, too."
prev: "/blog/why-you-should-use-webpack/"
next: "/blog/properly-size-images/"
---

I use a lot of [SVG](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics)s in my blog posts. They're great for simple diagrams or illustrations, like this one:

<figure>
    <img src="/media/nn-series/network.svg" />
    <figcaption>From my <a href="/series/neural-networks-from-scratch/">Neural Networks From Scratch</a> Series.</figcaption>
</figure>

I use [Inkscape](https://inkscape.org/), a free and open-source vector graphics editor, to make my SVGs. In the beginning, I just saved my SVGs using the default Inkscape format, something called _Inkscape SVG_. That turned out to be not ideal...

Let's use this SVG of a circle as an example:

![](/media/svg-post/circle.svg)

Here's the _Inkscape SVG_ markup for that laughably-simple icon:

```xml
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->

<svg
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   width="24"
   height="24"
   viewBox="0 0 24 24"
   id="svg4242"
   version="1.1"
   inkscape:version="0.91 r13725"
   sodipodi:docname="circle.svg">
  <defs
     id="defs4244" />
  <sodipodi:namedview
     id="base"
     pagecolor="#ffffff"
     bordercolor="#666666"
     borderopacity="1.0"
     inkscape:pageopacity="0.0"
     inkscape:pageshadow="2"
     inkscape:zoom="33.458333"
     inkscape:cx="12"
     inkscape:cy="12"
     inkscape:document-units="px"
     inkscape:current-layer="layer1"
     showgrid="false"
     units="px"
     inkscape:window-width="1680"
     inkscape:window-height="1005"
     inkscape:window-x="0"
     inkscape:window-y="1"
     inkscape:window-maximized="1" />
  <metadata
     id="metadata4247">
    <rdf:RDF>
      <cc:Work
         rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type
           rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
        <dc:title></dc:title>
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <g
     inkscape:label="Layer 1"
     inkscape:groupmode="layer"
     id="layer1">
    <circle
       style="opacity:1;fill:#000000;fill-opacity:1;stroke:none;stroke-width:4;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
       id="path4790"
       cx="12"
       cy="12"
       r="12" />
  </g>
</svg>
```

Wow. That's **2 KB** of markup for basically nothing.

Eventually (read: after an embarrassingly long time 🤷), I figured out that Inkscape had an _Optimized SVG_ output format. This was much more reasonable - using Inkscape's default settings, the _Optimized SVG_ markup for our circle is:

```xml
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg id="svg4242" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://www.w3.org/2000/svg" height="24" width="24" version="1.1" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" viewBox="0 0 24 24">
 <g id="layer1">
  <circle id="path4790" cx="12" cy="12" r="12"/>
 </g>
</svg>
```

Still, though, that's **387 bytes** just to draw a 24x24 circle. Surely this isn't the end of the road, right...?

Of course not. <span class="emph-special">Look, I figured out how to save files in the <span style="font-style: normal">Optimized SVG</span> format</span> doesn't warrant its own blog post.

The final evolution of our circle SVG is a result of passing it through [svgo](https://github.com/svg/svgo), a popular Node.js tool specifically for optimizing SVGs:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="12"/></svg>
```

**102 bytes**! That's much more like it.

Here's how all 3 versions of our circle SVG look when rendered:

<center>
<svg
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   width="24"
   height="24"
   viewBox="0 0 24 24"
   id="svg4242"
   version="1.1"
   inkscape:version="0.91 r13725"
   sodipodi:docname="circle.svg">
  <defs
     id="defs4244" />
  <sodipodi:namedview
     id="base"
     pagecolor="#ffffff"
     bordercolor="#666666"
     borderopacity="1.0"
     inkscape:pageopacity="0.0"
     inkscape:pageshadow="2"
     inkscape:zoom="33.458333"
     inkscape:cx="12"
     inkscape:cy="12"
     inkscape:document-units="px"
     inkscape:current-layer="layer1"
     showgrid="false"
     units="px"
     inkscape:window-width="1680"
     inkscape:window-height="1005"
     inkscape:window-x="0"
     inkscape:window-y="1"
     inkscape:window-maximized="1" />
  <metadata
     id="metadata4247">
    <rdf:RDF>
      <cc:Work
         rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type
           rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
        <dc:title></dc:title>
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <g
     inkscape:label="Layer 1"
     inkscape:groupmode="layer"
     id="layer1">
    <circle
       style="opacity:1;fill:#000000;fill-opacity:1;stroke:none;stroke-width:4;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
       id="path4790"
       cx="12"
       cy="12"
       r="12" />
  </g>
</svg>
</center>
<figcaption>The <i>Inkscape SVG</i> version: 2 KB</figcaption>

<br />

<center>
<svg id="svg4242" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://www.w3.org/2000/svg" height="24" width="24" version="1.1" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" viewBox="0 0 24 24">
 <g id="layer1">
  <circle id="path4790" cx="12" cy="12" r="12"/>
 </g>
</svg>
</center>
<figcaption>The <i>Optimized SVG</i> version: 387 bytes</figcaption>

<br />

<center>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="12"/></svg>
</center>
<figcaption>The final version: 102 bytes</figcaption>

Yup. They're all just plain black circles, but the third one is **20x** smaller than the first one. **Minify your SVGs**!

## How I Minify SVGs 

Sure, I could just manually run [svgo](https://github.com/svg/svgo) on any SVGs I wanted to use, but that felt wrong. What I _really_ wanted was a way to optimize SVGs at **build time** because:

- Who wants to have to remember to _manually_ optimize every SVG?!
- I wanted to keep using the _Inkscape SVG_ format, which retains some useful metadata (e.g. to preserve your session the next time you open the file).

This blog is built on [Gatsby.js](https://www.gatsbyjs.org/) (it's open-source on [Github](https://github.com/vzhou842/victorzhou.com) if you're curious), so I wrote a simple plugin called [gatsby-plugin-optimize-svgs](https://github.com/vzhou842/gatsby-plugin-optimize-svgs) to run `svgo` on any SVGs present in the build output. It's trivial to install:

```bash
$ npm install gatsby-plugin-optimize-svgs
```

```js
// Header: gatsby-config.js
module.exports = {
  plugins: [
    // ...
    'gatsby-plugin-optimize-svgs', // highlight-line
  ],
};
```

Here's what my results with `gatsby-plugin-optimize-svgs` were:

![](./media-link/svg-post/results.png)

**62 SVGs minified, reducing the total size from 459322 bytes to 208897 bytes, a reduction of 54.5%**! That's a total of 250 KB, or 4 KB per SVG. Keep in mind that all of my SVGs were already saved in the _Optimized SVG_ format - **these savings were on top of _already optimized SVGs_**. If you haven't thought about minifying your SVGs before, chances are you'd see much more drastic results.

## Now It's Your Turn

Go check your sites. Do they serve any SVGs? Make sure they're minified!
