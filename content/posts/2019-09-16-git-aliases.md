---
title: "Git Aliases I Use (Because I'm Lazy)"
date: "2019-09-16T12:00:00.000Z"
template: "post"
usesKatex: true
draft: false
twitterEmbed: true
slug: "/blog/git-aliases/"
img:
category: "Programming"
tags:
  - "Programming"
  - "Performance"
  - "For Beginners"
description: I really dislike typing out git commands, even the short ones.
prev: "/blog/avoid-premature-optimization/"
next: "/blog/minify-svgs/"
---

I finally started using [Git](https://git-scm.com) more heavily a few years ago when I first began building some of my bigger [side projects](/about/). Now, it's true that typing `git status` and `git push` is pretty easy, but if you've got some Git experience you know some commands can get rather long.

The one that always got me was:

```shell-session
$ git commit --amend --no-edit
```

This amends your staged changes into your most recent commit without changing its commit message (so Git won't open a text editor!). My most common use case for it was fixing changes I'd _just_ committed. Maybe I was just careless, but I'd often finish a commit only to find a typo or debug line not 30 seconds later 😠.

Typing all 28 characters of `git commit --amend --no-edit` gets old pretty fast. I'm pretty into [optimizing things](/tag/performance/) (even when I [probably shouldn't be](/blog/avoid-premature-optimization/) 🤷), so one day I procrastinated by thinking about ways to optimize my Git commands...

## My Git Aliases

If you google something like "_shorten git commands_," you'll quickly find out about <a rel="nofollow" href="https://git-scm.com/book/en/v2/Git-Basics-Git-Aliases" target="_blank">Git Aliases</a>. Turns out, shortening commands is built into Git! All you have to do is tell Git what you want to alias. For example, you can shorten `status` to `s` by copy and pasting this line into your terminal:

```
git config --global alias.s status
```

What that command actually does is update your `.gitconfig` file, which stores global Git configs:

```toml
// Header: ~/.gitconfig
[alias]
  s = status
```

Now, whenever you type in the alias `s`, Git will automatically replace it with `status`!

Here's a collection of my favorite Git Aliases:

```toml
// Header: ~/.gitconfig
[alias]
  s = status
  d = diff
  co = checkout
  br = branch
  last = log -1 HEAD
  cane = commit --amend --no-edit
  lo = log --oneline -n 10
  pr = pull --rebase
```
<figcaption>My .gitconfig</figcaption>

```
// Header: git aliases
git config --global alias.s status
git config --global alias.d diff
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.last "log -1 HEAD"
git config --global alias.cane "commit --amend --no-edit"
git config --global alias.pr "pull --rebase"
git config --global alias.lo "log --oneline -n 10"
```
<figcaption>You can copy and paste these to use my aliases!</figcaption>

Finally, there's one more shorthand I like to use:

```bash
// Header: ~/.bash_profile
# ... other stuff

alias g=git
```
<figcaption>You can use any text editor to add this to your <a href="https://www.quora.com/What-is-bash_profile-and-what-is-its-use" target="_blank">.bash_profile</a>.</figcaption>

This is a [Bash Alias](https://www.tldp.org/LDP/abs/html/aliases.html) and does exactly what you think it does. If you use a different shell, you can probably do this with a similar feature (e.g. [Zsh Aliasing](http://zsh.sourceforge.net/Intro/intro_8.html)).

You're ready. Using Git looks like this now:

```shell-session
$ g s
On branch master
Your branch is up to date with 'origin/master'.

nothing to commit, working tree clean
```
```shell-session
$ g br
* master
```
```shell-session
$ g co -b new-branch
Switched to a new branch 'new-branch'
```
```shell-session
$ g lo
Author: Victor Zhou <vzhou842@gmail.com>
Date:   Mon Aug 26 01:16:49 2019 -0700

    Bump version to 1.1.1
```

## Is this actually useful though...

Maybe? Depends on the person. It'll save you a little time if you're like me and do weird stuff like habitually spam "git status":

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">what weird habits do you have?<br><br>something I&#39;ve recently realized I do a lot: spamming &quot;git status&quot; and clearing my terminal <a href="https://t.co/LYlwM9hFAB">pic.twitter.com/LYlwM9hFAB</a></p>&mdash; Victor Zhou (@victorczhou) <a href="https://twitter.com/victorczhou/status/1173059464036962305?ref_src=twsrc%5Etfw">September 15, 2019</a></blockquote>

My opinion is that it's a small price to pay (~30 seconds of setup on each new machine) for a nice quality of life improvement that makes you feel fast and efficient. How much time you _actually_ save is debatable though...

## Some Quick Maths

Let's get a ballpark estimate of the true amount of time saved. I type around 135 words per minute, so assuming an average of 4 characters per word that's

$$
\frac{135 * 4}{60} = \boxed{9}
$$

characters per second.

Here's a table of how many characters my most commonly-used shortcuts save:

| Original command | Shortened command | Characters saved |
| --- | --- | --- |
| `git status` | `g s` | 7 |
| `git diff` | `g d` | 5 |
| `git checkout` | `g co` | 8 |
| `git branch` | `g br` | 6 |
| `git log -1 HEAD` | `g last` | 9 |
| `git commit --amend --no-edit` | `g cane` | 20 |

Next, I used the [history](https://en.wikipedia.org/wiki/History_(command)) command to see my 500 most recent commands. Here's the breakdown:

| Command | Times used |
| --- | --- |
| `g s` | 155 |
| `g d` | 47 |
| `g co` | 19 |
| `g br` | 26 |
| `g last` | 11 |
| `g cane` | 2 |
| Other Git commands | 94 |
| Non-Git commands | 146 |

Each of the 94 "other Git commands" saved 2 characters (since I shorten `git` to `g`), so the total # of characters saved was:

| Command | Times used | Characters saved | Total characters saved |
| --- | --- | --- | --- |
| `g s` | 155 | 7 | 1085 |
| `g d` | 47 | 5 | 235 |
| `g co` | 19 | 8 | 152 |
| `g br` | 26 | 6 | 156 |
| `g last` | 11 | 9 | 99 |
| `g cane` | 2 | 20 | 40 |
| Other Git commands | 94 | 2 | 188 |

$$
1085 + 235 + \ldots + 40 + 188 = \boxed{1955}
$$

characters saved, an average of $\frac{1955}{354} = \boxed{5.5}$ characters per Git command. Assuming I type ~100 Git commands in an average 8-hour workday, that's **550** characters saved, which converts to about **one minute saved per day** (using my earlier average typing speed of 9 chars/sec).

## Ok, so this isn't that practically useful. 😢

But, let me reiterate what I said earlier: it makes you **feel** efficient, and maybe there's some kind of placebo effect that actually makes you more productive.

What do you think? Do you use aliases, and why or why not? What other aliases do you like? Feel free to discuss below!

## Epilogue

As I was writing this post, I realized there were 3 more Git commands I often use that I'd been neglecting:

```shell-session
$ git add .
$ git commit -m 'message'
$ git reset --hard
```

I'm going to add those to my Git Aliases!

```
// Header: git aliases
git config --global alias.a "add ."
git config --global alias.cm "commit -m"
git config --global alias.rh "reset --hard"
```

<br />
