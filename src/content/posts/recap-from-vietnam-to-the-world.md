---
title: "Recap #cTENcf Birthday Bash Hanoi: From Vietnam to the World, Contributing to Kubernetes and Earning the Linux Foundation Scholarship"
subtitle: "Nobody starts as a Kubernetes reviewer. I started with typos in the docs, and the same trail of small, public contributions is what won me a Linux Foundation scholarship."
description: "Recap of my talk at #cTENcf Birthday Bash Hanoi, CNCF's 10th birthday, 21 Sep 2025: from Hacktoberfest and Apache Traffic Control to Kubernetes SIG Docs, the Vietnamese CNCF Glossary, and a 2025 LiFT scholarship."
date: 2025-09-21
tags: ["talk", "open-source", "kubernetes", "cncf", "community"]
---

*[Đọc bản tiếng Việt](/articles/recap-from-vietnam-to-the-world-vi.html).*

![From Vietnam to the World: Contributing to Kubernetes and earning the Linux Foundation Scholarship](/img/talks/2025-09-21/slide-1.jpg)

Contributions from Vietnam get noticed. Not because they're big, but because they're public and they
keep coming. That was the point of my talk at #cTENcf Birthday Bash Hanoi on 21 September 2025, the
Cloud Native Hanoi and VietOpenInfra meetup for CNCF's tenth birthday.

The talk had three parts: how I got into open source at all, how I went from Kubernetes user to
reviewer, and how that record turned into a 2025 Linux Foundation Training (LiFT) scholarship.

## It started with a T-shirt

![Hacktoberfest: why participate](/img/talks/2025-09-21/slide-5.jpg)

My first real push into open source was Hacktoberfest, the contribution challenge that runs every
October. Finish it and you get a T-shirt and some stickers. That's a modest reason to start, and it
worked.

I picked [Apache Traffic Control](https://github.com/apache/trafficcontrol), an open source CDN under
the Apache Software Foundation, because it was close to my day job. It had an active community and
plenty to do: bugs, dashboards, monitoring, new features.

It wasn't easy. One pull request,
[migrating the dynamic scripted Grafana dashboards to Scenes](https://github.com/apache/trafficcontrol/pull/7927),
ended at 25 commits, 58 files changed and 39 review comments. It was opened on 24 January 2024 and merged
on 28 February, after weeks of review and rework.

![Apache Traffic Control PR #7927: 25 commits, 58 files changed, 39 review comments](/img/talks/2025-09-21/slide-7.jpg)

In total I opened 21 pull requests to Traffic Control, and 12 of them were merged. Code, bug fixes,
docs and tutorials, helping other contributors: all of it counts. "Start small, grow global" was the
line on that slide, and I still think it's the right order.

## From user to reviewer, in three steps

![First contact with Kubernetes: running a production cluster](/img/talks/2025-09-21/slide-11.jpg)

My Kubernetes story didn't start with contributing. It started with running a production cluster for a
connected-car platform, about 80 servers. That was my first real exposure: deploying, troubleshooting,
keeping it stable. I was a user long before I was a contributor, and I think that's the right order too.

**Step 1: user to contributor.** Operating Kubernetes every day made me realise how much the docs
matter. Many of the problems I hit would have been solved faster with better documentation. So I
started fixing small things on the kubernetes/website repo: typos, glossary entries. Later I joined
SIG Docs Vietnam to localise and review content.

![Step 1: from user to contributor](/img/talks/2025-09-21/slide-12.jpg)

**Step 2: contributor to member.** I kept contributing to the docs, reviewed PRs, joined discussions and
went to SIG Docs meetings. In May 2025 I
[asked to join the Kubernetes org](https://github.com/kubernetes/org/issues/5593), and community
members who had seen the work gave their +1.

![Step 2: the community vouched for the membership request](/img/talks/2025-09-21/slide-14.jpg)

**Step 3: member to reviewer.** At this point the responsibility changes. It's less about contributing
and more about reviewing, and helping newcomers get their first PR merged. The day before the talk,
[a PR adding me as a reviewer and owner of the Vietnamese localisation team](https://github.com/kubernetes/website/pull/52424)
was merged. The question I ask myself changed from "what can I fix?" to "how can I help others
contribute?"

![Step 3: from member to reviewer and approver](/img/talks/2025-09-21/slide-15.jpg)

## Not all contributions are code

![CNCF Glossary: recognised on the CNCF blog](/img/talks/2025-09-21/slide-16.jpg)

Not all of it was code. I led the Vietnamese localisation of the
[Cloud Native Glossary](https://glossary.cncf.io/vi/), so engineers here can read cloud native terms in
their own language. The CNCF blog announced it in June 2025:
[Cloud Native Glossary: the Vietnamese version is live](https://www.cncf.io/blog/2025/06/26/cloud-native-glossary-the-vietnamese-version-is-live/).
Translation and docs are real contributions, and they're valued globally.

If you're looking for somewhere to start, [CLOtributor](https://clotributor.dev) searches CNCF projects
for issues that suit a first contribution.

## The scholarship

Every year the Linux Foundation awards 500 Shubhra Kar Linux Foundation Training (LiFT) scholarships
across 16 categories, from Open Source Newbie to Cloud Champion. I applied for two reasons. Advanced
Kubernetes training and certifications are expensive, and I wanted to go deeper. And I wanted to give
something back to the community here.

![Why I applied for the LiFT scholarship](/img/talks/2025-09-21/slide-19.jpg)

The form asks four questions. These are the answers I gave, and the tip I'd pass on for each:

1. **Which area of open source do you want to learn next, and why?** Kubernetes security: cluster
   hardening, fewer vulnerabilities, and the software supply chain (SBOMs, attestations, verifiable
   builds). *Tip: pick an area that excites you and solves a problem you actually have.*
2. **What is your open source experience?** Kubernetes docs and the CNCF Glossary, Apache Traffic
   Control, and a few tools of my own. *Tip: name your two or three strongest contributions, with
   numbers.*
3. **Why does it matter to your future?** Better infrastructure, stronger security, wider
   collaboration. *Tip: link your own growth to what the community gets back.*
4. **How do you use open source in your job?** A CDN on Traffic Control, an MLOps platform on Kubeflow,
   GitOps, monitoring and observability. *Tip: be specific about impact: scale, efficiency, cost.*

![Question 1: which area of open source to learn next](/img/talks/2025-09-21/slide-21.jpg)

![Question 2: open source experience](/img/talks/2025-09-21/slide-22.jpg)

I got it. The award covers one Linux Foundation eLearning course and one certification exam, at no
cost. More than the course itself, it was recognition from the Linux Foundation, and proof that a
record of small contributions from Vietnam is visible from the other side.

![Winning the 2025 LiFT scholarship](/img/talks/2025-09-21/slide-25.jpg)

## Your turn

![From Vietnam to the World: call to action](/img/talks/2025-09-21/slide-26.jpg)

What I asked the room to do is what I'd ask anyone reading this:

- **Join the community.** Cloud Native Hanoi and VietOpenInfra.
- **Start small.** Fix a typo, translate one term, open your first PR.
- **Use the tools.** [clotributor.dev](https://clotributor.dev) finds good first issues.
- **Be consistent.** One PR a week, one review a month. It adds up.

Happy tenth birthday, CNCF. If you open your first Kubernetes docs PR in Vietnamese, tag me. I'm one of
the reviewers now.
