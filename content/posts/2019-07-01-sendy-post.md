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
description: Mailchimp was getting too expensive, so I moved this blog's newsletter to Sendy.
prev: "/blog/replacing-disqus/"
next: "/blog/properly-size-images/"
---

When I [started this blog](/blog/first-50-days-of-blogging/), I used Mailchimp to create an email newsletter so readers could sign up to get new posts in their inbox. This was an easy choice: Mailchimp has a good free tier, is super easy to setup, and is a pleasure to use.

My [email newsletter](/subscribe/?src=sendy-post) has grown since those early days, though, and I'm going to pass the 2,000 subscriber mark soon 🎉, which is where Mailchimp's free tier ends. Thus, I did a bit of research to see how much it would cost me to keep my newsletter on Mailchimp:

![](./media-link/sendy-post/mailchimp-2.5k.png)

😲. At just 500 subscribers past the free tier limit, it would cost **$30 / month** to maintain my email list, _even if I didn't send any emails_.

It gets worse: when I started blogging, I set [a goal to reach 10,000 subscribers](/blog/first-50-days-of-blogging/#goals-for-year-one) by the end of my first year. Here's what life with Mailchimp would look like if I hit that milestone:

![](./media-link/sendy-post/mailchimp-10k.png)

**$75 / month** at 10k subscribers. Let's put that in perspective:

![](./media-link/sendy-post/mailchimp-price-graph.png "Monthly Costs for this blog with 10k subscribers")

Yup - it was time to say goodbye to Mailchimp.

## Amazon SES

I'd heard that Amazon had some kind of email offering before, so I decided to check that out first. It's called the [Amazon Simple Email Service](https://aws.amazon.com/ses/) (SES), and it does exactly what you'd think: allow customers to send out emails for cheap. Its pricing is simple, too: **$0.10 per 1000 emails**.

That's an attractive price, but Amazon SES _only_ lets you send emails - it's missing a lot of features that you'd want for an email newsletter. Sure, I could implement everything I needed from scratch, but that's got to be against some kind of programmer's oath, right? I figured _someone_  must've done this already...

## Sendy

...and I was right! That's what [Sendy](https://sendy.co/?ref=Tl4Ot) is for: it implements everything you'd want for an email newsletter on top of Amazon SES.

![](./media-link/sendy-post/sendy.png)

Pricing is simple: you pay a one time fee of $59 to buy a copy of Sendy, and then it's yours to use forever - you only pay [Amazon SES costs](https://aws.amazon.com/ses/pricing/) after that.

That's a big difference from Mailchimp - assuming 4 emails per month, here's how the monthly costs for each add up:

| # of Subscribers | Mailchimp (cheapest plan) Cost | Sendy Cost |
| --- | --- | --- |
| 2,000 | $0 | $0.80 |
| 5,000 | $50 | $2 |
| 10,000 | $75 | $4 |
| 25,000 | $189 | $10 |
| 50,000 | $259 | $20 |
<figcaption>This table speaks for itself.</figcaption>

### Sendy Setup

One downside of using Sendy is that you have to setup / host it yourself. However, this is really not that bad! Here's a quick runthrough of the steps I took to get up and running with Sendy:

1. Rent a \$5 server from [Digital Ocean](https://m.do.co/c/0e6cb6018b2a) with a pre-installed [LAMP](https://en.wikipedia.org/wiki/LAMP_(software_bundle)) stack.
2. Setup MySQL by creating a user and database for Sendy.
3. Configure a few values needed by Sendy, e.g. database credentials.
4. Upload the Sendy source code to my server using [rsync](https://linux.die.net/man/1/rsync).
5. Install a few PHP libraries and fiddle with a few settings (see the [Sendy Server Compatibility Checklist](https://sendy.victorzhou.com/_compatibility.php?i=1) for more details).
6. Finalize the Sendy installation using the provided License Key.
7. Export my subscribers from Mailchimp and import them into Sendy!

This whole process only takes ~1-2 hours. While my installation method requires a bit of sysadmin knowledge, it's also easy to install Sendy on something like Wordpress without any technical background.

> Note: I didn't include the $5 / month server in the cost table above because you could easily run Sendy for cheaper or even for free (on your existing web hosting). I personally am also using my Sendy server for other things, so that cost is partially subsidized.

### Sendy's Features

I won't elaborate too much here because [Sendy's website](https://sendy.co/?ref=Tl4Ot) does a great job describing their features, but here a few that were especially important to me:

- **Custom Fields**: I store a bit of extra information about my subscribers like where they subscribed from and what kind of posts they want to receive.
- **List Segmentation**: Using a custom field, I can choose to send certain emails to only specific segments of my email list. For example, if people want to receive _only_ Machine Learning content from me, List Segmentation lets me exclude them from non-ML emails when needed.
- **Bounce + Unsubscribe Handling**: Any bounces, complaints, or unsubscribes are automatically handled by Sendy!

In my experience, **Sendy has most of Mailchimp's core features** - you'll be well-equipped to manage your newsletter.

### Sendy's Drawback: Email Templates

Here's the catch: part of what you're paying Mailchimp for is the ability to easily create robust, responsive emails in a drag-and-drop editor. With Sendy, you'll have to **create your own email templates**. Sendy comes with a WYSIWYG editor to help you through this process, but even so it's no secret that making decent email templates is a pain. Different email clients support vastly differing subsets of HTML and CSS - nothing is standardized.

![](./media-link/sendy-post/sendy-editor.png "An example screenshot of Sendy's WYSIWYG email editor.")

There are several good open-source projects out there for this - I ended up using [Cerberus](https://github.com/TedGoas/Cerberus) to get started. If you want, you can also [view my email templates](https://github.com/vzhou842/victorzhou.com/tree/master/content/emails) on Github (my blog is open source)!

Making my own email templates took ~3 hours, so in total I spent around **5 hours upfront on Sendy**. That's a low price to pay for Sendy's benefits!

## Mailchimp saves 🕒, Sendy saves 💰

If you're willing to put in a few hours of work to setup Sendy, it can save you a lot of money in the long run. Still skeptical? Read more on the [official Sendy site](https://sendy.co/?ref=Tl4Ot).

Questions? Comments? Leave them below, or [tweet at me](https://twitter.com/victorczhou).
