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

😲. At just 500 subscribers past the free tier limit, it would cost **$30 / month** to maintain my email list, _even if I didn't send any emails_.

It gets worse: I'd previously set [a goal to reach 10,000 subscribers](/blog/first-50-days-of-blogging/#goals-for-year-one) by the end of my first year of blogging. Here's what life with Mailchimp would look like if I hit that milestone:

![](./media-link/sendy-post/mailchimp-10k.png)

**$75 / month** at 10k subscribers. Let's put that in perspective:

![](./media-link/sendy-post/mailchimp-price-graph.png "Monthly Costs for this blog with 10k subscribers")

Yup - it was time to say goodbye to Mailchimp.

## Amazon SES

I'd heard that Amazon had some kind of email offering before, so I decided to check that out first. It's called the Amazon Simple Email Service (SES), and it lives up to its name: 

Amazon SES's pricing is attractive, but it's missing a lot of features. Sure, I could implement everything I needed from scratch, but that's got to be against some kind of programmer's oath, right? I knew _someone_ else must've done this already...

## Sendy

...and I was right! That's what [Sendy](https://sendy.co/?ref=Tl4Ot) is for: it implements everything you'd want for an email newsletter on top of Amazon SES. Pricing is simple: you pay a one time fee of $59 to buy a copy of Sendy, and after that it's yours to use forever - you only pay [Amazon SES costs](https://aws.amazon.com/ses/pricing/) after that.

That's a big difference from Mailchimp - assuming 4 emails per month, here's how the monthly costs for each add up:

| # of Subscribers | Mailchimp (cheapest plan) Cost | Sendy Cost |
| --- | --- | --- |
| 2,000 | $0 | $0.80 |
| 5,000 | $50 | $2 |
| 10,000 | $75 | $4 |
| 25,000 | $189 | $10 |
| 50,000 | $259 | $20 |

Nothing more needs to be said. That table speaks for itself.

### Sendy Setup

One downside of using Sendy is that you have to setup / host it yourself. However, this is really not that bad! Here's a quick runthrough of the steps I took to get up and running with Sendy:

1. Rent a \$5 server from [Digital Ocean](https://m.do.co/c/0e6cb6018b2a) (yes, this is a referral link, but you'll get $50 of credit and help subsidize my hosting costs if you use it!) with a pre-installed [LAMP](https://en.wikipedia.org/wiki/LAMP_(software_bundle)) stack.
2. Setup MySQL by creating a user and database for Sendy.
3. Edit the `config.php` file provided in the Sendy source code to include the correct values of `dbHost`, `dbUser`, `dbPass`, and `dbName`.
4. Upload the Sendy source code to my server using [rsync](https://linux.die.net/man/1/rsync).
5. Install a few PHP libraries and fiddle with a few settings (see the [Sendy Server Compatibility Checklist](https://sendy.victorzhou.com/_compatibility.php?i=1) for more details).
6. Finalize the Sendy installation using the provided License Key.

My installation method requires a bit of sysadmin background, but it's also easy to install Sendy on something like Wordpress without any technical requirements.

### Sendy Features

### Sendy Drawbacks
