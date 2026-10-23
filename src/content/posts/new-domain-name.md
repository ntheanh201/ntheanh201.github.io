---
title: "New domain name ^^"
description: "Recently, I changed my blog from https://ntheanh201.vercel.app to https://ntheanh201.id.vn"
date: 2023-06-14
tags: ["website", "aws"]
---

Recently, I changed my blog from [https://ntheanh201.vercel.app](https://ntheanh201.vercel.app) to [https://ntheanh201.id.vn](https://ntheanh201.id.vn)

Here are some reasons:

-   The domain “[id.vn](http://id.vn)” is cheap, which costs me 132k VND ~ $5.62 for 2 years (it’s currently free for you guys from 18-23, I’ve just turned 24 :’( ).
-   Vercel provided me with powerful features such as CI/CD, live previews, … and a free subdomain, but I prefer to configure these things manually by myself.

So I decided to use AWS, which also doesn't cost much for this small thing as I calculated (with Free Tier plan)

My blog’s tech stack:

-   Go
-   Notion (as a database)
-   AWS CloudFront with S3 origin for hosting
-   Route53 for hosted zone

My todo list:

-   Github Actions to retrieve posts from Notion, build, generate UI, and upload to S3
-   Host all blog images on S3
-   Write more posts xD

![](/img/0b7c3d90d20066c482a8dbe309f853b877726bc7.png)

 

![](/img/81c3bc2f09c26ec1e181941330d7fcdfadae70ce.png)
