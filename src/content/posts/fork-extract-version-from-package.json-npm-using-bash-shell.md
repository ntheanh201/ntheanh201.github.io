---
title: "Fork: Extract version from package.json (NPM) using bash / shell"
description: "Link: https://gist.github.com/ntheanh201/3375b61dd6dfc3f55faad7061665a8da"
date: 2023-08-28
tags: ["linux"]
---

Link: [https://gist.github.com/ntheanh201/3375b61dd6dfc3f55faad7061665a8da](https://gist.github.com/ntheanh201/3375b61dd6dfc3f55faad7061665a8da)

```bash
PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",[:space:]]//g')

echo $PACKAGE_VERSION
```
