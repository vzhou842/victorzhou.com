---
title: "Mailchimp to Sendy: How I Cut Email Costs by 100x"
date: "2019-07-01T12:00:00.000Z"
template: "post"
draft: false
slug: "/blog/mailchimp-to-sendy/"
img:
category: "Blogging"
tags:
  - "Blogging"
  - "Best Practices"
description: How I saved big by moving this blog's newsletter from Mailchimp to Sendy.
prev: "/blog/replacing-disqus/"
next: "/blog/properly-size-images/"
---

When I [started this blog](/blog/first-50-days-of-blogging/), I used Mailchimp to create an email newsletter so readers could sign up to get new posts in their inbox. This was an easy choice: Mailchimp has a good free tier, is super easy to setup, and is a pleasure to use.

My email newsletter has grown since those early days, though, and I'm going to pass the 2,000 subscriber mark soon 🎉, which is where Mailchimp's free tier ends. Thus, I did a bit of research to see how much it would cost me to keep my newsletter on Mailchimp:

![](./media-link/sendy-post/mailchimp-2.5k.png)

Woah 😲. At just 500 subscribers past the free tier limit, it would cost **$30 / month** to just maintain my email list.

It gets worse: I'd previously set [a goal to reach 10,000 subscribers](/blog/first-50-days-of-blogging/#goals-for-year-one) by the end of my first year of blogging. Here's what life with Mailchimp would look like if I hit that milestone:

![](./media-link/sendy-post/mailchimp-10k.png)

**$75 / month** at 10k subscribers. Let's put that in perspective:

![Chart of monthly costs for this blog if I'd stayed with Mailchimp]()

It was time to say goodbye to Mailchimp.

## Amazon SES

I'd heard that Amazon had some kind of email offering before, so I decided to check that out first. It's called the Amazon Simple Email Service (SES), and it lives up to its name: 

Amazon SES's pricing is attractive, but it's missing a lot of features. Sure, I could implement everything I needed from scratch, but that's got to be against the programmer's oath or something, right? I _knew_ someone else must've done this already...

## Sendy

...and I was right! That's what [Sendy TODO LINK]() is for: it implements everything you'd want for an email newsletter on top of Amazon SES. Pricing is simple: you pay a one time fee of $x to buy a copy of Sendy, and after that it's yours to use forever - you only pay Amazon SES costs after that.

That's a big difference from Mailchimp:

![Chart of monthly costs for blog, Mailchimp vs Sendy]()

### Sendy Setup
