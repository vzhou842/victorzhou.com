---
title: "Git Aliases I Use (Because I'm Lazy)"
date: "2019-09-12T12:00:00.000Z"
template: "post"
draft: false
twitterEmbed: true
slug: "/blog/useful-git-aliases/"
img:
category: "Programming"
tags:
  - "Programming"
  - "For Beginners"
  - "Performance"
description: I really dislike typing out git commands, even the short ones.
prev: "/blog/avoid-premature-optimization/"
next: "/blog/minify-svgs/"
---

I finally started using [Git](https://git-scm.com) more heavily a few years ago when I first began building some of my bigger [side projects](/about/). Now, it's true that typing `git status` and `git push` is pretty easy, but if you've got some Git experience you know some commands can get rather long.

The one that always got me was:

```
$ git commit --amend --no-edit
```

This command amends your staged changes into your most recent commit without changing its commit message (meaning Git doesn't try to open a text editor!). My most common use case for it was making a quick fix to changes I'd just committed - maybe I was just careless, but I'd often finish a commit only to find a typo or leftover debug line not 30 seconds later 😠.

Here's something you should know about me: I'm pretty into [optimizing things](/tag/performance/) (even when I [probably shouldn't be](/blog/avoid-premature-optimization/) 🤷). So, naturally, I started procrastinating by thinking about ways to optimize my Git commands...

## My Git Aliases

If you google something like "shorten git commands", you'll quickly find out about <a rel="nofollow" href="https://git-scm.com/book/en/v2/Git-Basics-Git-Aliases" target="_blank">Git Aliases</a>. Turns out, shortening commands is built into Git! Aliases are pretty easy to setup, too. Here are the contents of a note I keep synced to iCloud that I use almost everytime I access a new machine:

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

All you have to do is copy and paste that into your terminal and you'll be good to go! What these commands actually do is update your `.gitconfig` file:

```
$ cat ~/.gitconfig
[alias]
    s = status
    d = diff
    co = checkout
    br = branch
    last = log -1 HEAD
    cane = commit --amend --no-edit
    pr = pull --rebase
    lo = log --oneline -n 10
```

If you type in one of the commands on the left-hand side of the `=`, Git will automatically replace it with whatever is on the right-hand side of the `=`.

There's one more alias I like to use:

```bash
// Header: ~/.bash_profile
# ... other stuff

alias g=git
```
<figcaption>You can use any text editor to add this to your <a href="https://www.quora.com/What-is-bash_profile-and-what-is-its-use" target="_blank">.bash_profile</a>.</figcaption>

This is a [Bash Alias](https://www.tldp.org/LDP/abs/html/aliases.html) and does exactly what you think it does. If you use a different shell, it probably has similar functionality (e.g. [Zsh Aliasing](http://zsh.sourceforge.net/Intro/intro_8.html)).

You're ready. Using Git looks like this now:

```
$ g s
On branch master
Your branch is up to date with 'origin/master'.

nothing to commit, working tree clean
```
```
$ g br
* master
```
```
$ g co -b new-branch
Switched to a new branch 'new-branch'
```
```
$ g lo
Author: Victor Zhou <vzhou842@gmail.com>
Date:   Mon Aug 26 01:16:49 2019 -0700

    Bump version to 1.1.1
```

## Is this actually useful though...?

Maybe? Depends on the person. It'll save you a little time if you're like me and do weird stuff like habitually spam "git status":

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">what weird habits do you have?<br><br>something I&#39;ve recently realized I do a lot: spamming &quot;git status&quot; and clearing my terminal <a href="https://t.co/LYlwM9hFAB">pic.twitter.com/LYlwM9hFAB</a></p>&mdash; Victor Zhou (@victorczhou) <a href="https://twitter.com/victorczhou/status/1173059464036962305?ref_src=twsrc%5Etfw">September 15, 2019</a></blockquote>

My opinion is that it's a small price to pay (~30 seconds of setup on each new machine) for a nice quality of life improvement that makes you feel fast and efficient. How much time you _actually_ save is debatable though...

## Some Quick Maths

Let's get a ballpark estimate of the amount of time these aliases save me. I type around 135 words per minute, which is 9 characters per second (assuming an average of 4 characters per word). Here's a table of how many characters my most commonly-used shortcuts save:

| Original command | Shortened command | Characters saved |
| --- | --- | --- |
| `git status` | `g s` | 7 |
| `git diff` | `g d` | 5 |
| `git checkout` | `g co` | 8 |
| `git branch` | `g br` | 6 |
| `git log -1 HEAD` | `g last` | 9 |
| `git commit --amend --no-edit` | `g cane` | 20 |

Finally, I used the [history](https://en.wikipedia.org/wiki/History_(command)) command to see my 500 most recent commands. Here's the breakdown:

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

Each of the 94 other Git commands saved 2 characters (since `git` was shortened to `g`), so the total amount of characters saved was:

| Command | Times used | Characters saved | Total characters saved |
| --- | --- | --- | --- |
| `g s` | 155 | 7 | 1085 |
| `g d` | 47 | 5 | 235 |
| `g co` | 19 | 8 | 152 |
| `g br` | 26 | 6 | 156 |
| `g last` | 11 | 9 | 99 |
| `g cane` | 2 | 20 | 40 |
| Other Git commands | 94 | 2 | 188 |

1085 + 235 + 152 + 156 + 99 + 40 + 188 = **1955** characters saved! That's an average of ~5.5 characters per Git command. 
